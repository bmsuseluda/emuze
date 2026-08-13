import { type RouteConfig, index, route } from "@react-router/dev/routes";

const createErrorDialog = (id: string) => [
  route("errorDialog", "customRoutes/categories.$category.errorDialog.tsx", {
    id: `${id}ErrorDialog`,
  }),
];

const createReleaseNotesDialog = (id: string) => [
  route("releaseNotes", "customRoutes/categories.$category.releaseNotes.tsx", {
    id: `${id}ReleaseNotes`,
  }),
];

const createGameDialog = (id: string) => [
  route(
    ":gameId",
    "customRoutes/categories.$category.$gameId.tsx",
    {
      id: `${id}GameDialog`,
    },
    [...createErrorDialog(`${id}GameDialog`)],
  ),
];

const createSettingsRoutes = (id: string) => [
  route(
    "settings",
    "customRoutes/categories.$category.settings.tsx",
    {
      id: `${id}Settings`,
    },
    [
      index("customRoutes/categories.$category.settings._index.tsx", {
        id: `${id}SettingsIndex`,
      }),
      route(
        "general",
        "customRoutes/categories.$category.settings.general.tsx",
        {
          id: `${id}SettingsGeneral`,
        },
        [...createErrorDialog(`${id}SettingsGeneral`)],
      ),
      route(
        "appearance",
        "customRoutes/categories.$category.settings.appearance.tsx",
        {
          id: `${id}SettingsAppearance`,
        },
      ),
      route(
        "advanced",
        "customRoutes/categories.$category.settings.advanced.tsx",
        {
          id: `${id}SettingsAdvanced`,
        },
      ),
      route("about", "customRoutes/categories.$category.settings.about.tsx", {
        id: `${id}SettingsAbout`,
      }),
    ],
  ),
];

const id = "lastPlayed";
const createCategoriesRoutes = () => [
  route("categories", "customRoutes/categories.tsx", {}, [
    route("lastPlayed", "customRoutes/categories.lastPlayed.tsx", [
      route(
        ":category/:gameId",
        "customRoutes/categories.$category.$gameId.tsx",
        {
          id: `${id}GameDialog`,
        },
        [...createErrorDialog(`${id}GameDialog`)],
      ),
      ...createSettingsRoutes(id),
      ...createErrorDialog(id),
      ...createReleaseNotesDialog(id),
    ]),
    route(":category", "customRoutes/categories.$category.tsx", [
      ...createGameDialog("category"),
      ...createSettingsRoutes("category"),
      ...createErrorDialog("category"),
      ...createReleaseNotesDialog("category"),
    ]),
  ]),
];

export default [
  index("customRoutes/_index.tsx"),
  ...createCategoriesRoutes(),
  ...createSettingsRoutes("initial"),
  route("/invalidateCaches", "customRoutes/invalidateCaches.tsx"),
  route("/gamepad-events", "customRoutes/gamepadEvents.tsx"),
] satisfies RouteConfig;
