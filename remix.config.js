/** @type {import('@remix-run/dev/config').AppConfig} */
module.exports = {
  appDirectory: "app",
  serverModuleFormat: "cjs",
  routes(defineRoutes) {
    return defineRoutes((route) => {
      route(
        "/settings",
        "routes/categories.$category.settings.tsx",
        {
          id: "initial",
        },
        () => {
          route("general", "routes/categories.$category.settings.general.tsx", {
            id: "initialGeneral",
          });
          route(
            "appearance",
            "routes/categories.$category.settings.appearance.tsx",
            {
              id: "initialAppearance",
            },
          );
        },
      );
    });
  },
  postcss: true,
  future: {
    v2_routeConvention: true,
    v2_headers: true,
    v2_meta: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_dev: {
      port: 8002,
    },
  },
};
