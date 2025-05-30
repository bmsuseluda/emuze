const config = {
    appId: "org.emuze.emuze",
    files: ["buildDesktop", "build", "public", "fetchMetaData/systems"],
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
    electronLanguages: ["en-US"],
    afterPack: "./afterPackScript.js",
    buildDependenciesFromSource: false,
    npmRebuild: false,
};
export default config;
