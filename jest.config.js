const path = require("path");
const fromRoot = (d) => path.join(__dirname, d);

/** @type {import('ts-jest/dist/types').ProjectConfigTsJest} */
const baseConfig = {
  preset: "ts-jest",
  moduleNameMapper: {
    "~/(.*)": fromRoot("app/$1"),
  },
};

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: [
    {
      ...baseConfig,
      testEnvironment: "node",
      testMatch: ["<rootDir>/app/server/**/*.test.ts"],
    },
    {
      ...baseConfig,
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/app/**/*.test.ts?(x)"],
      testPathIgnorePatterns: ["<rootDir>/app/server"],
    },
  ],
};
