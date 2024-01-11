module.exports = {
  "*.{json, md}": ["prettier --write"],
  "package.json": ["generate:readme"],
  "app/**/*.{ts,tsx}": ["eslint", "prettier --write", "vitest related --run"],
};
