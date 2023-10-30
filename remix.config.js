/** @type {import('@remix-run/dev/config').AppConfig} */
module.exports = {
  appDirectory: "app",
  devServerPort: 8002,
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
    v2_dev: true,
    v2_routeConvention: true,
  },
};
