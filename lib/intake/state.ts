// Intake checklist state machine. Pure functions over a serializable
// IntakeStateData document that is persisted (as JSON) per chat. The chat route
// loads it each turn, feeds it to the extractor, applies the result here, then
// hands the next target to the interviewer (or the digest to the assessor).

import { CHECKLIST, CHECKLIST_BY_ID, RED_FLAG_IDS } from "./checklist";

export const MAX_ATTEMPTS = 3;

export type SubjectStatus =
  | "pending"
  | "partial"
  | "complete"
  | "refused"
  | "exhausted"
  | "not_applicable";

export type SubjectState = {
  id: string;
  status: SubjectStatus;
  answer: string | null;
  attempts: number;
};

export type IntakeProfile = {
  sex: "female" | "male" | "other" | null;
  age: string | null; // free-form range, e.g. "42", "40-49"
  mainComplaint: string | null;
};

export type ModelUsage = {
  inputTokens: number;
  outputTokens: number;
  calls: number;
};

export type IntakePhase = "intake" | "assessment_ready" | "assessed";

export type IntakeStateData = {
  version: 1;
  profile: IntakeProfile;
  subjects: SubjectState[];
  usage: Record<string, ModelUsage>; // keyed by gateway model id
  targetId: string | null; // subject asked about last turn
  redFlagNotes: string[];
  phase: IntakePhase;
};

export type ExtractorUpdate = {
  id: string;
  status: "partial" | "complete" | "refused";
  answer: string;
};

export type ExtractorResult = {
  profile: Partial<IntakeProfile>;
  updates: ExtractorUpdate[];
  redFlags: string[];
  userWantsConclusion: boolean;
};

// Deterministic backstop for "just tell me what you see" so handoff never hinges
// solely on the extractor's userWantsConclusion flag.
const CONCLUSION_REQUEST =
  /\b(ce\s+(vezi|crezi|p[ăa]rere)|spune[-\s]?mi\s+(tu\s+)?ce|d[ăa]-?mi\s+(verdictul|concluzia|p[ăa]rerea|analiza)|trage\w*\s+(o\s+)?concluzie|gata\s+cu\s+(întreb|intreb)|destul\s+cu\s+(întreb|intreb)|ce\s+ai\s+de\s+spus)\b/i;

export function userRequestedConclusion(text: string | undefined): boolean {
  return !!text && CONCLUSION_REQUEST.test(text);
}

export function seedIntakeState(): IntakeStateData {
  return {
    version: 1,
    profile: { sex: null, age: null, mainComplaint: null },
    subjects: CHECKLIST.map((s) => ({
      id: s.id,
      status: "pending",
      answer: null,
      attempts: 0,
    })),
    usage: {},
    targetId: null,
    redFlagNotes: [],
    phase: "intake",
  };
}

// Tolerant loader: accepts whatever came back from the DB JSON column and
// repairs/upgrades it so a schema drift never crashes a conversation.
export function coerceIntakeState(raw: unknown): IntakeStateData {
  const seed = seedIntakeState();
  if (!raw || typeof raw !== "object") {
    return seed;
  }
  const data = raw as Partial<IntakeStateData>;
  const byId = new Map(
    (data.subjects ?? []).map((s) => [s.id, s] as const)
  );
  // Re-project onto the current checklist so added/removed categories are handled.
  const subjects: SubjectState[] = CHECKLIST.map((def) => {
    const prev = byId.get(def.id);
    return {
      id: def.id,
      status: prev?.status ?? "pending",
      answer: prev?.answer ?? null,
      attempts: prev?.attempts ?? 0,
    };
  });
  return {
    version: 1,
    profile: { ...seed.profile, ...(data.profile ?? {}) },
    subjects,
    usage: data.usage ?? {},
    targetId: data.targetId ?? null,
    redFlagNotes: data.redFlagNotes ?? [],
    phase: data.phase ?? "intake",
  };
}

function isApplicable(id: string, profile: IntakeProfile): boolean {
  const def = CHECKLIST_BY_ID[id];
  if (!def) {
    return false;
  }
  if (def.femaleOnly) {
    // Only applicable once we know the person is female. For male/other it is
    // permanently not applicable; while sex is unknown we defer (not a blocker).
    return profile.sex === "female";
  }
  return true;
}

// Apply one extractor pass: merge profile, set statuses/answers, then run the
// deterministic retry/exhaustion bookkeeping on the subject we asked about.
export function applyExtractor(
  state: IntakeStateData,
  result: ExtractorResult,
  opts: { penalizeTarget?: boolean } = {}
): void {
  // When the extractor call itself failed (rate limit / model error) we must
  // not spend one of the target subject's attempts on our own infra failure.
  const penalizeTarget = opts.penalizeTarget !== false;
  if (result.profile.sex) {
    state.profile.sex = result.profile.sex;
  }
  if (result.profile.age) {
    state.profile.age = result.profile.age;
  }
  if (result.profile.mainComplaint) {
    state.profile.mainComplaint = result.profile.mainComplaint;
  }

  for (const update of result.updates) {
    const subject = state.subjects.find((s) => s.id === update.id);
    if (!subject) {
      continue;
    }
    if (subject.status === "complete" || subject.status === "refused") {
      // Already settled; still let a fuller answer overwrite a partial one.
      if (update.status === "complete") {
        subject.answer = update.answer || subject.answer;
        subject.status = "complete";
      }
      continue;
    }
    subject.status = update.status;
    subject.answer = update.answer || subject.answer;
  }

  for (const note of result.redFlags) {
    if (note && !state.redFlagNotes.includes(note)) {
      state.redFlagNotes.push(note);
    }
  }

  // Mark female-only subjects not applicable once sex is known to be non-female.
  for (const subject of state.subjects) {
    if (
      !isApplicable(subject.id, state.profile) &&
      CHECKLIST_BY_ID[subject.id]?.femaleOnly &&
      state.profile.sex &&
      state.profile.sex !== "female"
    ) {
      subject.status = "not_applicable";
    }
  }

  // Retry bookkeeping: if we targeted a subject last turn and it still isn't
  // settled, that counts as one spent attempt. After MAX_ATTEMPTS, move on.
  if (penalizeTarget && state.targetId) {
    const target = state.subjects.find((s) => s.id === state.targetId);
    if (target && (target.status === "pending" || target.status === "partial")) {
      target.attempts += 1;
      if (target.attempts >= MAX_ATTEMPTS) {
        target.status = "exhausted";
      }
    }
  }
}

function isSettled(s: SubjectState): boolean {
  return (
    s.status === "complete" ||
    s.status === "refused" ||
    s.status === "exhausted" ||
    s.status === "not_applicable"
  );
}

// Next subject to ask about: first unsettled, applicable subject still under the
// attempt cap, in checklist order (A→Z).
export function pickNextTarget(state: IntakeStateData): string | null {
  for (const subject of state.subjects) {
    if (!isApplicable(subject.id, state.profile)) {
      continue;
    }
    if (subject.status === "pending" || subject.status === "partial") {
      if (subject.attempts < MAX_ATTEMPTS) {
        return subject.id;
      }
    }
  }
  return null;
}

// The intake is complete when every applicable subject is settled AND every
// applicable red-flag subject has been probed at least once (so we never
// conclude without having raised apnea / movement disorders / mood).
export function isIntakeComplete(state: IntakeStateData): boolean {
  for (const subject of state.subjects) {
    if (!isApplicable(subject.id, state.profile)) {
      continue;
    }
    if (!isSettled(subject)) {
      return false;
    }
    if (
      RED_FLAG_IDS.has(subject.id) &&
      subject.attempts === 0 &&
      subject.status !== "complete" &&
      subject.status !== "refused"
    ) {
      return false;
    }
  }
  return true;
}

export function coverage(state: IntakeStateData): {
  covered: number;
  applicable: number;
} {
  let covered = 0;
  let applicable = 0;
  for (const subject of state.subjects) {
    if (!isApplicable(subject.id, state.profile)) {
      continue;
    }
    applicable += 1;
    if (isSettled(subject)) {
      covered += 1;
    }
  }
  return { covered, applicable };
}

export function accumulateUsage(
  state: IntakeStateData,
  modelId: string,
  usage: { inputTokens?: number; outputTokens?: number } | undefined
): void {
  const entry = state.usage[modelId] ?? {
    inputTokens: 0,
    outputTokens: 0,
    calls: 0,
  };
  entry.inputTokens += usage?.inputTokens ?? 0;
  entry.outputTokens += usage?.outputTokens ?? 0;
  entry.calls += 1;
  state.usage[modelId] = entry;
}

// Compact human-readable rendering of the covered subjects vs. what remains,
// used to steer the interviewer each turn.
export function renderProgress(state: IntakeStateData): {
  covered: string;
  remaining: string;
} {
  const covered: string[] = [];
  const remaining: string[] = [];
  for (const subject of state.subjects) {
    const def = CHECKLIST_BY_ID[subject.id];
    if (!def || !isApplicable(subject.id, state.profile)) {
      continue;
    }
    if (isSettled(subject)) {
      covered.push(`${subject.id}. ${def.category} (${subject.status})`);
    } else {
      remaining.push(`${subject.id}. ${def.category}`);
    }
  }
  return {
    covered: covered.join("; ") || "(încă nimic)",
    remaining: remaining.join("; ") || "(toate acoperite)",
  };
}

// Full structured digest handed to the assessor model.
export function renderDigest(state: IntakeStateData): string {
  const lines: string[] = [];
  const { profile } = state;
  lines.push(
    `Profil: sex=${profile.sex ?? "necunoscut"}, vârstă=${profile.age ?? "necunoscută"}.`
  );
  if (profile.mainComplaint) {
    lines.push(`Problema principală: ${profile.mainComplaint}`);
  }
  lines.push("");
  lines.push("Domenii investigate:");
  for (const subject of state.subjects) {
    const def = CHECKLIST_BY_ID[subject.id];
    if (!def) {
      continue;
    }
    if (subject.status === "not_applicable") {
      continue;
    }
    const answer =
      subject.answer?.trim() ||
      (subject.status === "refused"
        ? "(a refuzat să răspundă)"
        : subject.status === "exhausted"
          ? "(neclarificat după mai multe încercări)"
          : "(neatins)");
    lines.push(`- ${def.category} [${subject.status}]: ${answer}`);
  }
  if (state.redFlagNotes.length > 0) {
    lines.push("");
    lines.push(`Semnale de alarmă observate: ${state.redFlagNotes.join("; ")}`);
  }
  return lines.join("\n");
}
