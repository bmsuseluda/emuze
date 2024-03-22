import type {
  Application,
  FindEntryNameFunction,
} from "~/server/applicationsDB.server/types";
import { findGameNameById } from "~/server/applicationsDB.server/nameMappings/findGameNameById";
import scummVmGames from "./nameMapping/scummvm.json";
import { spawnSync } from "child_process";
import { createAbsoluteEntryPath } from "~/types/jsonFiles/category";
import { checkFlatpakIsInstalled } from "~/server/execute.server";
import { readCategory } from "~/server/categories.server";
import { isApplicationWindows } from "~/types/jsonFiles/applications";

const findScummVmGameNameViaMapping: FindEntryNameFunction = ({
  entry: { name },
}) => findGameNameById(name, scummVmGames, "scummvm");

const findScummVmGameNameViaDetectLinux = (absoluteEntryPath: string) => {
  if (checkFlatpakIsInstalled(scummvm.flatpakId)) {
    return spawnSync(
      "flatpak",
      ["run", scummvm.flatpakId, `--path=${absoluteEntryPath}`, "--detect"],
      {
        encoding: "utf-8",
        maxBuffer: 1000000000,
      },
    ).stdout.toString();
  }
  return null;
};

const findScummVmGameNameViaDetectWindows = (
  absoluteEntryPath: string,
  applicationPath: string,
) => {
  try {
    return spawnSync(
      applicationPath,
      [`--path=${absoluteEntryPath}`, "--detect"],
      {
        encoding: "utf-8",
        maxBuffer: 1000000000,
      },
    ).stdout.toString();
  } catch (e) {
    console.log("scummvm could not started", e);
    return null;
  }
};

export const parseScummDetectResult = (result: string) => {
  const rows = result.split("\n");
  const entryNameRow = rows.find((row) => row.match(/\w+:\w+.*/));
  if (entryNameRow) {
    // split by minimum of 3 whitespaces
    const [, name] = entryNameRow.split(/\s{3,}/);
    return name.split("(")[0].trim();
  }
  return null;
};

const findScummVmGameNameViaDetect: FindEntryNameFunction = ({
  entry: { name, path },
  categoriesPath,
  categoryName,
}) => {
  const absoluteEntryPath = createAbsoluteEntryPath(
    categoriesPath,
    categoryName,
    path,
  );

  const categoryData = readCategory("scumm");
  const application = categoryData?.application;

  if (application) {
    const data = isApplicationWindows(application)
      ? findScummVmGameNameViaDetectWindows(absoluteEntryPath, application.path)
      : findScummVmGameNameViaDetectLinux(absoluteEntryPath);

    if (data) {
      const detectedName = parseScummDetectResult(data);
      if (detectedName) {
        return detectedName;
      }
    }
  }

  return name;
};

const findScummVmGameName: FindEntryNameFunction = (props) => {
  const detectedName = findScummVmGameNameViaDetect(props);
  if (detectedName) {
    return detectedName;
  }

  const mappedName = findScummVmGameNameViaMapping(props);
  if (mappedName) {
    return mappedName;
  }

  return props.entry.name;
};

export const scummvm: Application = {
  id: "scummvm",
  name: "ScummVM",
  flatpakId: "org.scummvm.ScummVM",
  entryAsDirectory: true,
  omitAbsoluteEntryPathAsLastParam: true,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    absoluteEntryPath,
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push(`--path=${absoluteEntryPath}`);
    optionParams.push("--auto-detect");
    return optionParams;
  },
  findEntryName: findScummVmGameName,
};
