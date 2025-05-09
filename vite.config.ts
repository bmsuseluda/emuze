import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: [
      /**
       * TODO: remove if fixed: https://github.com/streamich/react-use/issues/2353
       */
      "react-use",
    ],
  },
  optimizeDeps: { exclude: ["@kmamal/sdl"], include: ["react-use"] },
  plugins: [reactRouter()],
});
