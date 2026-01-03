import { existsSync } from "node:fs";
import { downloadFile } from "../../app/server/downloadFile.server.js";
import nodepath from "node:path";
import { writeFile } from "../../app/server/readWriteData.server.js";
import { fileURLToPath } from "node:url";

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));
const projectPath = nodepath.join(__dirname, "..", "..");
const resultPath = nodepath.join(
  projectPath,
  "app",
  "server",
  "applicationsDB.server",
  "applications",
  "cemu",
  "nameMapping",
);

const exitOnResponseCodeError = () => {
  process.exit(1);
};

const downloadJson = (url: string, filePath: string) => {
  const promise = new Promise((resolve, reject) => {
    downloadFile(
      url,
      filePath,
      () => {
        console.log(url);
        console.log(filePath);
        if (!existsSync(filePath)) {
          console.error(`${filePath} does not exist`);
          reject();
        }
        console.log(`${url} downloaded`);
        resolve(filePath);
      },
      () => {
        exitOnResponseCodeError();
        reject();
      },
    );
  });

  return promise;
};

type TitleId = string;

type Titles = Record<
  TitleId,
  {
    title_id: TitleId;
    platform_device: "CTR" | "WUP";
  }
>;

interface TitleNameEntry {
  US?: string;
  JP?: string;
  GB?: string;
  BE?: string;
  AT?: string;
  DE?: string;
}

type TitleNames = Record<TitleId, TitleNameEntry>;

const tempFolderPath = nodepath.join(__dirname, "temp");

const getTitleName = (titleNames: TitleNames, titleId: string) => {
  if (titleId in titleNames) {
    const titleNamesForId = titleNames[titleId];
    const { US, GB } = titleNamesForId;
    return US || GB || Object.values(titleNamesForId).at(0) || "";
  }
  return "";
};

const namesToPatch: Record<string, string> = {
  "TEKKEN TAG TOURNAMENT Wii U EDITION":
    "TEKKEN TAG TOURNAMENT 2: Wii U EDITION",
};

const importCemuNameMappings = async () => {
  const titlesUrl = "https://dantheman827.github.io/nus-info/titles.json";
  const titleNamesUrl =
    "https://dantheman827.github.io/nus-info/title-names.json";
  const titlesFilePath = nodepath.join(tempFolderPath, "titles.json");
  const titleNamesFilePath = nodepath.join(tempFolderPath, "titleNames.json");

  const promises = [
    downloadJson(titlesUrl, titlesFilePath),
    downloadJson(titleNamesUrl, titleNamesFilePath),
  ];

  Promise.allSettled(promises).then(async () => {
    const titles: Titles = await import(titlesFilePath);
    const titleNames: TitleNames = await import(titleNamesFilePath);

    const extractedGames = Object.values(titles)
      .filter(({ platform_device }) => platform_device === "WUP")
      .reduce((previousValue, { title_id }) => {
        const titleName = getTitleName(titleNames, title_id).replaceAll(
          "™",
          "",
        );
        const namePatch = namesToPatch[titleName];
        return { ...previousValue, [title_id]: namePatch || titleName };
      }, {});

    writeFile(extractedGames, nodepath.join(resultPath, "cemu.json"));
  });
};

importCemuNameMappings();
