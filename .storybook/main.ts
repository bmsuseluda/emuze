// Necessary to use typescript alias. For more information see https://github.com/storybookjs/storybook/issues/6316
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
    builder: {
      name: "@storybook/builder-webpack5",
      options: {
        lazyCompilation: true,
        fsCache: true,
      },
    },
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  stories: ["../app/**/*.stories.mdx", "../app/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }
    return config;
  },
  docs: {
    autodocs: true,
  },
};

export default config;
