// Necessary to use typescript alias. For more information see https://github.com/storybookjs/storybook/issues/6316
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  core: {
    builder: "webpack5",
    disableTelemetry: true,
  },
  framework: "@storybook/react",
  features: {
    babelModeV7: true,
  },
  stories: ["../app/**/*.stories.mdx", "../app/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  webpackFinal: async (config, { configType }) => {
    config.resolve.plugins = [new TsconfigPathsPlugin()];
    return config;
  },
};
