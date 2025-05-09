import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

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
  plugins: [
    remix({
      appDirectory: "app",
      serverModuleFormat: "cjs",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
        v3_routeConfig: true,
      },
    }),
  ],
});
