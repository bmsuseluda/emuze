import type { StorybookConfig } from "@storybook/core-common";

// Necessary to use typescript alias. For more information see https://github.com/storybookjs/storybook/issues/6316
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: StorybookConfig = {
  core: {
    builder: "webpack5",
    disableTelemetry: true,
  },
  framework: "@storybook/react",
  features: {
    babelModeV7: true,
    storyStoreV7: true,
  },
  stories: ["../app/**/*.stories.mdx", "../app/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }
    return config;
  },
};

export default config;
