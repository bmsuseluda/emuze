import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
    builder: {
      name: "@storybook/builder-vite",
      options: {
        viteConfigPath: "./.storybook/vite.config.ts",
      },
    },
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: ["../app/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-docs"],
  staticDirs: ["../public"],
};

export default config;
