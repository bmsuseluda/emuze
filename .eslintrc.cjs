/** @type {import('eslint/dist/types')} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:import/recommended",
    "plugin:react-hooks/recommended-legacy",
    "plugin:@typescript-eslint/recommended",
    "plugin:storybook/recommended",
    "plugin:deprecation/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json"
  },
  plugins: ["@typescript-eslint", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "jsx-a11y/anchor-has-content": "off",
    "@typescript-eslint/no-empty-function": "off",
    "node/no-unpublished-import": "off",
    "node/no-missing-import": "off",
    "node/no-unsupported-features/es-syntax": "off",
    "no-process-exit": "off",
    "import/no-unresolved": "off",
    "import/no-absolute-path": "error",
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          "app/*",
        ],
      }
    ]
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
