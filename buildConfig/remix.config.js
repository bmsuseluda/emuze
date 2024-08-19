"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createErrorDialog = function (route, id) {
    route("errorDialog", "customRoutes/categories.$category.errorDialog.tsx", {
        id: "".concat(id, "ErrorDialog"),
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
    });
};
var createCategoriesRoutes = function (route) {
    route("categories", "customRoutes/categories.tsx", {}, function () {
        route("lastPlayed", "customRoutes/categories.lastPlayed.tsx", function () {
            createSettingsRoutes(route, "lastPlayed");
            createErrorDialog(route, "lastPlayed");
        });
        route(":category", "customRoutes/categories.$category.tsx", function () {
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
        });
    },
    postcss: true,
};
module.exports = appConfig;
