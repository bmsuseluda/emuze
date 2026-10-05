import devtoolsJsonDefault from "vite-plugin-devtools-json";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";

const devtoolsJson =
  devtoolsJsonDefault as unknown as typeof devtoolsJsonDefault.default;

const ReactCompilerConfig = {};

export default defineConfig({
  server: {
    port: 3000,
    warmup: { clientFiles: ["./app/root.tsx"] },
  },
  ssr: {
    noExternal: [
      /**
       * TODO: remove if fixed: https://github.com/streamich/react-use/issues/2353
       */
      "react-use",
    ],
  },
  optimizeDeps: {
    exclude: ["@kmamal/sdl", "@kmamal/sdl3", "node-hid"],
    include: ["react-use"],
  },
  plugins: [
    devtoolsJson(),
    reactRouter(),
    babel({
      include: /\.[jt]sx?$/,
      plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
    }),
  ],
});
