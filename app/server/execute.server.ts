import type { ChildProcess, ExecFileException } from "node:child_process";
import { execFile, execFileSync } from "node:child_process";
import kill from "tree-kill";
import fkill from "fkill";
import { readAppearance, readGeneral } from "./settings.server.js";
import type { Category, Entry } from "../types/jsonFiles/category.js";
import { createAbsoluteEntryPath } from "../types/jsonFiles/category.js";
import { isGeneralConfigured } from "../types/jsonFiles/settings/general.js";
import { isWindows } from "./operationsystem.server.js";
import { existsSync } from "node:fs";
import { setErrorDialog } from "./errorDialog.server.js";
import type { SystemId } from "./categoriesDB.server/systemId.js";
import { categories } from "./categoriesDB.server/index.js";
import { log } from "./debug.server.js";
import { getInstalledApplicationForCategoryOnWindows } from "./applications.server.js";
import { addToLastPlayedCached } from "./lastPlayed.server.js";
import {
  checkFlatpakIsInstalled,
  EmulatorNotInstalledError,
} from "./applicationsDB.server/checkEmulatorIsInstalled.js";
import type {
  Application,
  EnvironmentVariableFunction,
} from "./applicationsDB.server/types.js";
import type { Settings } from "../types/jsonFiles/settings/index.js";
import nodepath from "node:path";
import { readCategory } from "./categoryDataCache.server.js";
import { importElectron } from "./importElectron.server.js";
import sdl from "@kmamal/sdl";

let childProcess: ChildProcess;

const killChildProcess = () => {
  log("debug", "kill process");

  if (childProcess?.pid) {
    if (isWindows()) {
      fkill(childProcess.pid, { tree: true }).catch((reason) => {
        log("error", "Failed to kill process:", reason);
      });
    } else {
      kill(childProcess.pid, "SIGKILL", (err) => {
        if (err) {
          log("error", "Failed to kill process:", err);
        }
      });
    }
  }
};

const closeGameOnGamepad = () => {
  const devices = sdl.controller.devices;
  if (devices.length > 0) {
    devices.forEach((device) => {
      const controller = sdl.controller.openDevice(device);
      controller.on("buttonDown", (event) => {
        if (event.button === "a" && controller.buttons.back) {
          log("debug", "buttons", controller.buttons);
          if (childProcess && !childProcess.killed) {
            killChildProcess();
          }
        }
      });
    });
  }
};
closeGameOnGamepad();

type ExecFileCallback = (
  error: ExecFileException | null,
  stdout: string,
  stderr: string,
) => void;

const execFileCallback =
  (reject: (reason: ExecFileException) => void): ExecFileCallback =>
  (error, stdout, stderr) => {
    if (error) {
      if (error.signal !== "SIGKILL" && error.signal !== "SIGABRT") {
        log("error", "executeBundledApplication", stderr);
        reject(error);
      }
    }
    if (stdout && stdout.length > 0) {
      log("debug", stdout);
    }
  };

const executeApplication = async (file: string, args: string[]) => {
  const electron = importElectron();
  return new Promise<void>((resolve, reject) => {
    childProcess = execFile(
      file,
      args,
      {
        encoding: "utf8",
      },
      execFileCallback(reject),
    );

    electron?.globalShortcut?.register("CommandOrControl+C", () => {
      killChildProcess();
    });

    childProcess?.on("close", (code) => {
      electron?.globalShortcut?.unregister("CommandOrControl+C");
      if (code === 0 || code === null) {
        setTimeout(() => {
          resolve();
        }, 1000);
      } else {
        resolve();
      }
    });
  });
};

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
  const params = [];
  params.push(...optionParams);

  if (!omitAbsoluteEntryPathAsLastParam) {
    params.push(absoluteEntryPath);
  }
  return executeApplication(
    nodepath.join(process.env.APPDIR || "", "emulators", bundledPath),
    params,
  );
};

const executeApplicationOnLinux = async ({
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

    return executeApplication("flatpak", params);
  } else {
    throw new EmulatorNotInstalledError(applicationName);
  }
};

const executeApplicationOnWindows = async ({
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

    return executeApplication(applicationPath, params);
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
            await executeApplicationOnWindows({
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
            await executeApplicationOnLinux({
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
