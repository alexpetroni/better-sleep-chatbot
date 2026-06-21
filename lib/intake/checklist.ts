// Canonical intake checklist: the 26 consolidated cause categories (A–Z) from
// docs/cauze-somn-checklist.md. Each conversation tracks one SubjectState per
// entry here. The symptom/pattern picture is captured separately in the intake
// `profile` (sex, age, mainComplaint), not as a tracked subject.
//
// `hints` feed both the extractor (what counts as "covered" for this domain)
// and the interviewer (what to probe). Keep them short — they are concatenated
// into prompts every turn.

export type SubjectDef = {
  id: string; // "A".."Z"
  category: string; // Romanian label shown in prompts/digest
  redFlag?: boolean; // must be probed at least once before concluding
  femaleOnly?: boolean; // applicability gate (sex === "female")
  hints: string;
};

export const CHECKLIST: SubjectDef[] = [
  {
    id: "A",
    category: "Ritm circadian & cronotip",
    hints:
      "regularitatea programului, decalaj lucru vs. weekend (jet lag social), cronotip natural, ture de noapte, fus orar",
  },
  {
    id: "B",
    category: "Expunere la lumină",
    hints:
      "lumină naturală în prima oră după trezire, ecrane/lumină puternică seara, lumină nocturnă în dormitor",
  },
  {
    id: "C",
    category: "Igienă de somn & comportamente de seară",
    hints:
      "telefon/ecrane în pat, lucru în pat, clock-watching, lipsă de relaxare seara, somn de zi, mișcare în timpul zilei",
  },
  {
    id: "D",
    category: "Cofeină, alcool, nicotină, canabis",
    hints:
      "cofeină (tip, cantitate, până la ce oră), alcool seara și a doua jumătate a nopții, nicotină, canabis ca somnifer",
  },
  {
    id: "E",
    category: "Alimentație seara",
    hints:
      "cină târzie sau grea, zahăr/procesate seara, lichide multe înainte de culcare (→ nocturie)",
  },
  {
    id: "F",
    category: "Medicamente & istoric de tratament",
    hints:
      "medicamente care pot perturba somnul, sevraj recent, suplimente stimulante; ce a încercat deja și ce a încetat să funcționeze",
  },
  {
    id: "G",
    category: "Mediul fizic de somn",
    hints:
      "întuneric, zgomot, temperatură, aer/ventilație, saltea/pernă/textile, dormitor asociat cu stres",
  },
  {
    id: "H",
    category: "Partener, copii, animale",
    hints:
      "partener care sforăie/se mișcă/are alt program, copii mici cu treziri nocturne, animale în dormitor",
  },
  {
    id: "I",
    category: "Câmpuri electromagnetice & poluanți",
    hints:
      "(periferic) telefon/router lângă pat, mucegai, aer viciat; atinge scurt doar dacă pare relevant",
  },
  {
    id: "J",
    category: "Respirație în somn / apnee",
    redFlag: true,
    hints:
      "sforăit puternic, pauze/gâfâieli observate, gură uscată/dureri de cap matinale, somnolență mare ziua, respirație orală, greutate centrală",
  },
  {
    id: "K",
    category: "Neurologic-motor",
    redFlag: true,
    hints:
      "picioare neliniștite (ameliorate de mișcare), zvâcniri, crampe, bruxism, parasomnii, punerea în act a viselor (REM)",
  },
  {
    id: "L",
    category: "Durere & musculo-scheletal",
    hints:
      "durere nocturnă (spate, articulații, cap), fibromialgie, neuropatie care fragmentează somnul",
  },
  {
    id: "M",
    category: "Digestiv & axa intestin-creier",
    hints:
      "reflux/GERD (mai rău culcat), balonare/disbioză/SIBO, intoleranțe, cină grea care întârzie digestia",
  },
  {
    id: "N",
    category: "Urinar / nocturie",
    hints:
      "treziri pentru urinat (de câte ori), vezică hiperactivă; la bărbați 50+ prostată/vezică",
  },
  {
    id: "O",
    category: "Cardiovascular & circulator",
    hints:
      "tensiune mare, palpitații/aritmii, circulație periferică, edeme — mai ales dacă apar treziri cu inima accelerată",
  },
  {
    id: "P",
    category: "Hormonal feminin",
    femaleOnly: true,
    hints:
      "fază luteală/SPM, perimenopauză/menopauză (bufeuri, transpirații), sarcină/postpartum; dacă somnul s-a schimbat în jurul tranziției",
  },
  {
    id: "Q",
    category: "Endocrin general",
    hints:
      "tiroidă (frig/lentoare vs. agitație/palpitații), cortizol/HPA (trezire matinală în alertă), la bărbați schimbări de energie/testosteron",
  },
  {
    id: "R",
    category: "Metabolic — glicemie",
    hints:
      "treziri 2-4 AM cu foame/tremur/transpirații/inimă accelerată, rezistență la insulină, pre/diabet",
  },
  {
    id: "S",
    category: "Deficiențe nutriționale",
    hints:
      "fier/feritină (mai ales cu picioare neliniștite), magneziu, vitamina D, B12 — analize recente dacă există",
  },
  {
    id: "T",
    category: "Inflamație, imunitate, alergii, histamină",
    hints:
      "inflamație cronică, autoimunitate, congestie nazală, simptome de histamină seara (mâncărimi, obraji roșii)",
  },
  {
    id: "U",
    category: "Hiperactivare neurovegetativă",
    hints:
      "obosit dar agitat, corp încordat la culcare, inimă accelerată/tresăriri, incapacitate de a se relaxa, hipervigilență",
  },
  {
    id: "V",
    category: "Cognitiv-emoțional",
    hints:
      "gânduri care aleargă/reluat ziua, perfecționism/control, emoții nerezolvate, incapacitate de a închide ziua, sens/identitate",
  },
  {
    id: "W",
    category: "Psihiatric",
    redFlag: true,
    hints:
      "dispoziție (lipsă de interes/apăsare) și anxietate, blând; atacuri de panică nocturne, coșmaruri/traumă, ADHD — adu cu tact",
  },
  {
    id: "X",
    category: "Stres & context de viață",
    hints:
      "nivel de stres (1-10), stresor principal și de când; burnout, doliu, separare, bani, caregiving, mutare, boală în familie",
  },
  {
    id: "Y",
    category: "Siguranță & mediu psihologic",
    hints:
      "sentiment de siguranță în locuință/cartier, tensiune cu cei din casă, ritualuri de siguranță (verificat încuietori)",
  },
  {
    id: "Z",
    category: "Insomnie condiționată / învățată",
    hints:
      "pat = alertă, teamă de a nu dormi, încercat forțat să adoarmă, doarme mai bine în altă parte (hotel/canapea)",
  },
];

export const CHECKLIST_BY_ID: Record<string, SubjectDef> = Object.fromEntries(
  CHECKLIST.map((s) => [s.id, s])
);

export const RED_FLAG_IDS = new Set(
  CHECKLIST.filter((s) => s.redFlag).map((s) => s.id)
);
