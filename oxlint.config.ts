import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "warn",
  },
  plugins: [
    "eslint",
    "typescript",
    "unicorn",
    "react",
    "react-perf",
    "oxc",
    "import",
    "jsdoc",
    "node",
    "promise",
    "vitest",
  ],
  rules: {
    "eslint/no-unused-vars": "error",
    "no-useless-spread": "off",
    "require-mock-type-parameters": "off",
  },
});
