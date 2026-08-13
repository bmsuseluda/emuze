export default {
  "app/**/*.{ts,tsx}": [
    "oxlint --fix",
    "prettier --write",
    "vitest related --run",
  ],
};
