import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import type { DefineRouteFunction } from "@remix-run/dev/dist/config/routes";
import { installGlobals } from "@remix-run/node";

const createErrorDialog = (route: DefineRouteFunction, id: string) => {
  route("errorDialog", "customRoutes/categories.$category.errorDialog.tsx", {
    id: `${id}ErrorDialog`,
  });
};

const createGameDialog = (route: DefineRouteFunction, id: string) => {
  route(
    ":gameId",
    "customRoutes/categories.$category.$gameId.tsx",
    {
      id: `${id}GameDialog`,
    },
    () => {
      createErrorDialog(route, `${id}GameDialog`);
    },
  );
};

const createSettingsRoutes = (route: DefineRouteFunction, id: string) => {
  route(
    "settings",
    "customRoutes/categories.$category.settings.tsx",
    {
      id: `${id}Settings`,
    },
    () => {
      route("", "customRoutes/categories.$category.settings._index.tsx", {
        index: true,
        id: `${id}SettingsIndex`,
      });
      route(
        "general",
        "customRoutes/categories.$category.settings.general.tsx",
        {
          id: `${id}SettingsGeneral`,
        },
        () => {
          createErrorDialog(route, `${id}SettingsGeneral`);
        },
      );
      route(
        "appearance",
        "customRoutes/categories.$category.settings.appearance.tsx",
        {
          id: `${id}SettingsAppearance`,
        },
      );
      route("about", "customRoutes/categories.$category.settings.about.tsx", {
        id: `${id}SettingsAbout`,
      });
    },
  );
};

const createCategoriesRoutes = (route: DefineRouteFunction) => {
  route("categories", "customRoutes/categories.tsx", {}, () => {
    route("lastPlayed", "customRoutes/categories.lastPlayed.tsx", () => {
      const id = "lastPlayed";
      route(
        ":category/:gameId",
        "customRoutes/categories.$category.$gameId.tsx",
        {
          id: `${id}GameDialog`,
        },
        () => {
          createErrorDialog(route, `${id}GameDialog`);
        },
      );
      createSettingsRoutes(route, id);
      createErrorDialog(route, id);
    });
    route(":category", "customRoutes/categories.$category.tsx", () => {
      createGameDialog(route, "category");
      createSettingsRoutes(route, "category");
      createErrorDialog(route, "category");
    });
  });
};

installGlobals();

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
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("/", "customRoutes/_index.tsx", { index: true });
          createCategoriesRoutes(route);
          createSettingsRoutes(route, "initial");
          route("/invalidateCaches", "customRoutes/invalidateCaches.tsx");
        });
      },
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
  ],
});
