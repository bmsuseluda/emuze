"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createErrorDialog = function (route, id) {
    route("errorDialog", "customRoutes/categories.$category.errorDialog.tsx", {
        id: "".concat(id, "ErrorDialog"),
    });
};
var createGameDialog = function (route, id) {
    route(":gameId", "customRoutes/categories.$category.$gameId.tsx", {
        id: "".concat(id, "GameDialog"),
    }, function () {
        createErrorDialog(route, "".concat(id, "GameDialog"));
    });
};
var createSettingsRoutes = function (route, id) {
    route("settings", "customRoutes/categories.$category.settings.tsx", {
        id: "".concat(id, "Settings"),
    }, function () {
        route("", "customRoutes/categories.$category.settings._index.tsx", {
            index: true,
            id: "".concat(id, "SettingsIndex"),
        });
        route("general", "customRoutes/categories.$category.settings.general.tsx", {
            id: "".concat(id, "SettingsGeneral"),
        }, function () {
            createErrorDialog(route, "".concat(id, "SettingsGeneral"));
        });
        route("appearance", "customRoutes/categories.$category.settings.appearance.tsx", {
            id: "".concat(id, "SettingsAppearance"),
        });
        route("about", "customRoutes/categories.$category.settings.about.tsx", {
            id: "".concat(id, "SettingsAbout"),
        });
    });
};
var createCategoriesRoutes = function (route) {
    route("categories", "customRoutes/categories.tsx", {}, function () {
        route("lastPlayed", "customRoutes/categories.lastPlayed.tsx", function () {
            var id = "lastPlayed";
            route(":category/:gameId", "customRoutes/categories.$category.$gameId.tsx", {
                id: "".concat(id, "GameDialog"),
            }, function () {
                createErrorDialog(route, "".concat(id, "GameDialog"));
            });
            createSettingsRoutes(route, id);
            createErrorDialog(route, id);
        });
        route(":category", "customRoutes/categories.$category.tsx", function () {
            createGameDialog(route, "category");
            createSettingsRoutes(route, "category");
            createErrorDialog(route, "category");
        });
    });
};
var appConfig = {
    appDirectory: "app",
    serverModuleFormat: "cjs",
    routes: function (defineRoutes) {
        return defineRoutes(function (route) {
            route("/", "customRoutes/_index.tsx", { index: true });
            createCategoriesRoutes(route);
            createSettingsRoutes(route, "initial");
            route("/invalidateCaches", "customRoutes/invalidateCaches.tsx");
        });
    },
    postcss: true,
};
module.exports = appConfig;
