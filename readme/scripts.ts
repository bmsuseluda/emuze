import { categories } from "../app/server/categoriesDB.server";
import { ApplicationId } from "../app/server/applicationsDB.server/applicationId";

const preConfigured: ApplicationId[] = [
  "ares",
  "aresMegaDrive",
  "aresSega32x",
  "aresSegaCd",
  "aresSuperNintendo",
  "scummvm",
  "duckstation",
];

export const createSystemsTable = () =>
  Object.values(categories)
    .map(
      (category) =>
        `| ${category.names[0]} | ${category.defaultApplication.name} | ${preConfigured.includes(category.defaultApplication.id) ? "Yes" : "No"} |`,
    )
    .join("\n");

const windowsDownloadFileName = `emuze-Setup-${process.env.npm_package_version}.exe`;
const linuxDownloadFileName = `emuze-${process.env.npm_package_version}.AppImage`;

const getDownloadLink = (fileName: string) =>
  `https://github.com/bmsuseluda/emuze/releases/download/v${process.env.npm_package_version}/${fileName}`;

export const getWindowsDownloadLink = () =>
  `[Download](${getDownloadLink(
    windowsDownloadFileName,
  )}) the latest Version of emuze and install it.`;

export const getLinuxDownloadLink = (prefix?: string) =>
  `${prefix}[Download](${getDownloadLink(
    linuxDownloadFileName,
  )}) the latest Version of emuze`;
