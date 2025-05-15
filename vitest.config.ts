import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// This is intentional to remove plugins from testing
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { plugins, ...viteConfigWithoutPlugins } = viteConfig;

export default mergeConfig(
  viteConfigWithoutPlugins,
  defineConfig({
    test: {
      globals: true,
      environment: "happy-dom",
    },
  }),
);
