import nextJest from "next/jest.js";

// Uses Next.js's SWC transform and loads next.config/.env like the app does.
const createJestConfig = nextJest({ dir: "./" });

export default createJestConfig({
  testEnvironment: "<rootDir>/src/test/jsdomEnvironment.mjs",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // `server-only` throws unless bundled for React Server Components.
    "^server-only$": "<rootDir>/src/test/emptyModule.ts",
  },
});
