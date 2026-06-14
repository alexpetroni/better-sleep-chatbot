import { generateDummyPassword } from "./db/utils";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

export const suggestions = [
  "Sunt obosit, dar nu reușesc să adorm seara",
  "Mă trezesc pe la 3 noaptea și nu mai adorm",
  "Dorm destul, dar tot mă trezesc nerefăcut",
  "Mi s-a dat programul de somn complet peste cap",
];
