import { categories } from "../app/server/categoriesDB.server";
import type { ApplicationId } from "../app/server/applicationsDB.server/applicationId";
import { SystemId } from "../app/server/categoriesDB.server/systemId";

const preConfigured: ApplicationId[] = [
  "ares",
  "aresMegaDrive",
  "aresSega32x",
  "aresSegaCd",
  "aresSuperNintendo",
  "scummvm",
  "duckstation",
  "pcsx2",
];

const nameOverwrites: Partial<Record<SystemId, string>> = {
  dos: "Dos ([Supported Games](https://github.com/bmsuseluda/emuze/blob/main/app/server/applicationsDB.server/applications/dosbox/nameMapping/dos.json))",
};

export const createSystemsTable = () =>
  Object.values(categories)
    .map(
      (category) =>
        `| ${nameOverwrites[category.id] || category.names[0]} | ${category.defaultApplication.name} | ${preConfigured.includes(category.defaultApplication.id) ? "Yes" : "No"} |`,
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
