import type { Configuration } from "electron-builder";

const config: Configuration = {
  appId: "org.emuze.emuze",
  files: ["buildDesktop", "build", "public", "fetchMetaData/systems"],
  extraFiles: ["emulators/**", "biosOpenSource/**", "CHANGELOG.md"],
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
    artifactName: "${productName}-Setup-${version}.${ext}",
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
    extraFiles: [
      "updater/linux",
      {
        from: ".github/scripts/emuze.metainfo.xml",
        to: "usr/share/metainfo/emuze.metainfo.xml",
      },
      {
        from: ".github/scripts/emuze.metainfo.xml",
        to: "usr/share/metainfo/emuze.appdata.xml",
      },
    ],
    publish: {
      provider: "github",
      publishAutoUpdate: false,
    },
  },
  mac: {
    target: [{ target: "default", arch: "arm64" }],
  },
  electronLanguages: ["en-US"],
  afterPack: "./afterPackScript.js",
  nativeRebuilder: "legacy",
  buildDependenciesFromSource: true,
  nodeGypRebuild: false,
  npmRebuild: false,
  toolsets: { appimage: "1.0.3" },
};

export default config;
