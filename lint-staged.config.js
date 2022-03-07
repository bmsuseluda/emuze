module.exports = {
  "*.{json, md}": ["prettier --write"],
  "app/**/*.{ts,tsx}": [
    "eslint",
    "prettier --write",
    "npm run test:findRelatedTests",
  ],
};
