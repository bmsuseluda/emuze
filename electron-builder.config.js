"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    appId: "org.emuze.emuze",
    files: ["buildDesktop", "build", "public", "fetchMetaData"],
    extraFiles: ["emulators/**"],
    win: {
        target: [
            {
                target: "nsis",
                arch: ["x64"],
            },
        ],
        icon: "public/icon.ico",
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
    },
    linux: {
        target: [
            {
                target: "AppImage",
                arch: ["x64"],
            },
        ],
        category: "Emulator",
        icon: "public/icons/icon512x512.png",
    },
    afterPack: "./afterPackScript.js",
};
exports.default = config;
