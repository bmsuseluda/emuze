import type { ChildProcess } from "child_process";
import { execFile, execFileSync } from "child_process";
import { readAppearance, readGeneral } from "./settings.server";
import type { Category, Entry } from "../types/jsonFiles/category";
import { createAbsoluteEntryPath } from "../types/jsonFiles/category";
import { isGeneralConfigured } from "../types/jsonFiles/settings/general";
import { isWindows } from "./operationsystem.server";
import { existsSync } from "fs";
import { setErrorDialog } from "./errorDialog.server";
import type { SystemId } from "./categoriesDB.server/systemId";
import { categories } from "./categoriesDB.server";
import { log } from "./debug.server";
import { getInstalledApplicationForCategoryOnWindows } from "./applications.server";
import { addToLastPlayedCached } from "./lastPlayed.server";
import {
  checkFlatpakIsInstalled,
  EmulatorNotInstalledError,
} from "./applicationsDB.server/checkEmulatorIsInstalled";
import type {
  Application,
  EnvironmentVariableFunction,
} from "./applicationsDB.server/types";
import type { Settings } from "../types/jsonFiles/settings";
import nodepath from "path";
import { readCategory } from "./categoryDataCache.server";
import { globalShortcut } from "electron";
import sdl from "@kmamal/sdl";

let childProcess: ChildProcess;

const closeGameOnGamepad = () => {
  const devices = sdl.controller.devices;
  if (devices.length > 0) {
    devices.forEach((device) => {
      const controller = sdl.controller.openDevice(device);
      controller.on("buttonDown", (event) => {
        if (event.button === "back" && controller.buttons.a) {
          log("debug", "buttons", controller.buttons);
          if (childProcess && !childProcess.killed) {
            childProcess.kill();
          }
        }
      });
    });
  }
};
closeGameOnGamepad();

const executeBundledApplication = async ({
  absoluteEntryPath,
  optionParams,
  omitAbsoluteEntryPathAsLastParam,
  bundledPath,
}: {
  absoluteEntryPath: string;
  optionParams: string[];
  omitAbsoluteEntryPathAsLastParam?: boolean;
  bundledPath: string;
}) => {
  return new Promise<void>((resolve, reject) => {
    const params = [];

    params.push(...optionParams);

    if (!omitAbsoluteEntryPathAsLastParam) {
      params.push(absoluteEntryPath);
    }

    childProcess = execFile(
      nodepath.join(process.env.APPDIR || "", "emulators", bundledPath),
      params,
      {
        encoding: "utf8",
      },
      (error, stdout, stderr) => {
        if (error) {
          log("error", stderr);
          reject(error);
        }
        log("debug", stdout);
      },
    );

    globalShortcut?.register("CommandOrControl+C", () => {
      childProcess.kill();
    });

    childProcess.on("close", (code) => {
      globalShortcut?.unregister("CommandOrControl+C");
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
};

const executeApplicationOnLinux = ({
  applicationFlatpakOptionParams,
  applicationFlatpakId,
  absoluteEntryPath,
  optionParams,
  omitAbsoluteEntryPathAsLastParam,
  categoriesPath,
  applicationName,
}: {
  applicationFlatpakOptionParams?: string[];
  applicationFlatpakId: string;
  absoluteEntryPath: string;
  optionParams: string[];
  omitAbsoluteEntryPathAsLastParam?: boolean;
  categoriesPath: string;
  applicationName: string;
}) => {
  if (checkFlatpakIsInstalled(applicationFlatpakId)) {
    const params = ["run", `--filesystem=${categoriesPath}`];
    if (applicationFlatpakOptionParams) {
      params.push(...applicationFlatpakOptionParams);
    }
    params.push(applicationFlatpakId);
    params.push(...optionParams);

    if (!omitAbsoluteEntryPathAsLastParam) {
      params.push(absoluteEntryPath);
    }

    execFileSync("flatpak", params, {
      encoding: "utf8",
    });
  } else {
    throw new EmulatorNotInstalledError(applicationName);
  }
};

const executeApplicationOnWindows = ({
  applicationData,
  applicationsPath,
  absoluteEntryPath,
  optionParams,
  environmentVariables,
  omitAbsoluteEntryPathAsLastParam,
}: {
  applicationData: Application;
  applicationsPath: string;
  absoluteEntryPath: string;
  optionParams: (applicationsPath?: string) => string[];
  environmentVariables: (applicationsPath?: string) => void;
  omitAbsoluteEntryPathAsLastParam?: boolean;
}) => {
  const applicationPath = getInstalledApplicationForCategoryOnWindows(
    applicationData,
    applicationsPath,
  )?.path;

  if (applicationPath) {
    environmentVariables(applicationPath);
    const params = [];
    params.push(...optionParams(applicationPath));

    if (!omitAbsoluteEntryPathAsLastParam) {
      params.push(absoluteEntryPath);
    }

    execFileSync(applicationPath, params, {
      encoding: "utf8",
    });
  } else {
    throw new EmulatorNotInstalledError(applicationData.name);
  }
};

const setEnvironmentVariables = ({
  defineEnvironmentVariables,
  categoryData,
  settings,
  applicationPath,
}: {
  defineEnvironmentVariables: EnvironmentVariableFunction;
  categoryData: Category;
  settings: Settings;
  applicationPath?: string;
}) => {
  Object.entries(
    defineEnvironmentVariables({
      categoryData,
      settings,
      applicationPath,
    }),
  ).forEach(([key, value]) => {
    if (value) {
      process.env[key] = value;
    }
  });
};

export const startGame = async (
  systemId: SystemId,
  entryData: Entry,
  parentEntryData?: Entry,
) => {
  const generalData = readGeneral();
  const categoryData = readCategory(systemId);
  const categoryDB = categories[systemId];
  const applicationData = categoryDB.application;

  if (isGeneralConfigured(generalData) && categoryData && applicationData) {
    const settings: Settings = {
      general: generalData,
      appearance: readAppearance(true),
    };

    const absoluteEntryPath = createAbsoluteEntryPath(
      generalData.categoriesPath,
      categoryData.name,
      entryData.path,
    );

    if (existsSync(absoluteEntryPath)) {
      const {
        defineEnvironmentVariables,
        createOptionParams,
        flatpakId,
        flatpakOptionParams,
      } = applicationData;

      const environmentVariables = (applicationPath?: string) => {
        if (defineEnvironmentVariables) {
          setEnvironmentVariables({
            defineEnvironmentVariables,
            categoryData,
            settings,
            applicationPath,
          });
        }
      };

      const optionParams = (applicationPath?: string) =>
        createOptionParams
          ? createOptionParams({
              entryData,
              categoryData,
              settings,
              absoluteEntryPath,
              hasAnalogStick: categoryDB.hasAnalogStick,
              applicationPath,
            })
          : [];

      try {
        if (isWindows() && generalData.applicationsPath) {
          if (applicationData.bundledPathWindows) {
            environmentVariables();
            await executeBundledApplication({
              bundledPath: applicationData.bundledPathWindows,
              absoluteEntryPath,
              optionParams: optionParams(),
              omitAbsoluteEntryPathAsLastParam:
                applicationData.omitAbsoluteEntryPathAsLastParam,
            });
          } else {
            executeApplicationOnWindows({
              applicationData,
              applicationsPath: generalData.applicationsPath,
              absoluteEntryPath,
              optionParams,
              environmentVariables,
              omitAbsoluteEntryPathAsLastParam:
                applicationData.omitAbsoluteEntryPathAsLastParam,
            });
          }
        } else {
          environmentVariables();
          if (applicationData.bundledPathLinux) {
            await executeBundledApplication({
              bundledPath: applicationData.bundledPathLinux,
              absoluteEntryPath,
              optionParams: optionParams(),
              omitAbsoluteEntryPathAsLastParam:
                applicationData.omitAbsoluteEntryPathAsLastParam,
            });
          } else {
            executeApplicationOnLinux({
              applicationFlatpakOptionParams: flatpakOptionParams,
              applicationFlatpakId: flatpakId,
              absoluteEntryPath,
              optionParams: optionParams(),
              omitAbsoluteEntryPathAsLastParam:
                applicationData.omitAbsoluteEntryPathAsLastParam,
              categoriesPath: generalData.categoriesPath,
              applicationName: applicationData.name,
            });
          }
        }

        addToLastPlayedCached(parentEntryData || entryData, systemId);
      } catch (error) {
        log("error", "executeApplication", error);
        if (error instanceof Error) {
          setErrorDialog(`Launch failed`, error.message);
        }
        throw new Error();
      }
    } else {
      setErrorDialog(
        `Launch failed`,
        `${entryData.path} does not exist anymore`,
      );
      throw new Error();
    }
  }
};

export const installFlatpak = (flatpakId: string) => {
  try {
    log("debug", `Start Install ${flatpakId}`);
    execFileSync("flatpak", ["install", "--noninteractive", flatpakId], {
      encoding: "utf8",
    });
    log("debug", `End Install ${flatpakId}`);
    return true;
  } catch (error) {
    log("error", "installFlatpak", error);
    return false;
  }
};
