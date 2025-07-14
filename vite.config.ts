import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";

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
  optimizeDeps: { exclude: ["@bmsuseluda/sdl"], include: ["react-use"] },
  plugins: [devtoolsJson(), reactRouter()],
});
