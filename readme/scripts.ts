import { categories } from "~/server/categoriesDB.server";

export const createSystemsTable = () =>
  Object.values(categories)
    .map(
      (category) =>
        `| ${category.names[0]} | ${category.applications
          .map((application) => application.name)
          .join("<br>")} | ${category.defaultApplication.name} |`,
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
