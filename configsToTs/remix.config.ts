import type { AppConfig } from "@remix-run/dev";
import type { DefineRouteFunction } from "@remix-run/dev/dist/config/routes";

const createErrorDialog = (route: DefineRouteFunction, id: string) => {
  route("errorDialog", "customRoutes/categories.$category.errorDialog.tsx", {
    id: `${id}ErrorDialog`,
  });
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
    },
  );
};

const createCategoriesRoutes = (route: DefineRouteFunction) => {
  route("categories", "customRoutes/categories.tsx", {}, () => {
    route("lastPlayed", "customRoutes/categories.lastPlayed.tsx", () => {
      createSettingsRoutes(route, "lastPlayed");
      createErrorDialog(route, "lastPlayed");
    });
    route(":category", "customRoutes/categories.$category.tsx", () => {
      createSettingsRoutes(route, "category");
      createErrorDialog(route, "category");
    });
  });
};

const appConfig: AppConfig = {
  appDirectory: "app",
  serverModuleFormat: "cjs",
  routes(defineRoutes) {
    return defineRoutes((route) => {
      route("/", "customRoutes/_index.tsx", { index: true });
      createCategoriesRoutes(route);
      createSettingsRoutes(route, "initial");
    });
  },
  postcss: true,
};

module.exports = appConfig;
