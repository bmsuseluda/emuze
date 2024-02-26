import type {
  Application,
  FindEntryNameFunction,
} from "~/server/applicationsDB.server/types";
import { findGameNameById } from "~/server/applicationsDB.server/nameMappings/findGameNameById";
import scummVmGames from "./nameMapping/scummvm.json";

const findScummVmGameNameViaMapping: FindEntryNameFunction = ({
  entry: { name },
}) => findGameNameById(name, scummVmGames, "scummvm");

// TODO: check if this is a good pattern. It depends on executing the emulator for every game
// const findScummVmGameNameViaDetectLinux = (absoluteEntryPath: string) => {
//   // TODO: what to do if the emulator is not installed?
//   return spawnSync(
//     "flatpak",
//     ["run", scummvm.flatpakId, `--path=${absoluteEntryPath}`, "--detect"],
//     {
//       encoding: "utf-8",
//       maxBuffer: 1000000000,
//     },
//   ).stdout.toString();
// };
//
// const findScummVmGameNameViaDetect: FindEntryNameFunction = ({
//   entry: { name, path },
//   categoriesPath,
//   categoryName,
// }) => {
//   const absoluteEntryPath = createAbsoluteEntryPath(
//     categoriesPath,
//     categoryName,
//     path,
//   );
//   // TODO: add windows way
//   // TODO: what to do if the emulator is not installed?
//   const data = findScummVmGameNameViaDetectLinux(absoluteEntryPath);
//
//   const rows = data.split("\n");
//   const entryNameRow = rows.find((row) => row.match(/\w+:\w+.*/));
//   if (entryNameRow) {
//     // split by minimum of 3 whitespaces
//     const [, name] = entryNameRow.split(/\s{3,}/);
//     return name.split("(")[0].trim();
//   }
//
//   return name;
// };
//
// const findScummVmGameName: FindEntryNameFunction = (props) => {
//   const detectedName = findScummVmGameNameViaDetect(props);
//   if (detectedName) {
//     return detectedName;
//   }
//
//   const mappedName = findScummVmGameNameViaMapping(props);
//   if (mappedName) {
//     return mappedName;
//   }
//
//   return props.entry.name;
// };

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
  findEntryName: findScummVmGameNameViaMapping,
};
