import type { ExecFileException } from "node:child_process";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import nodepath from "node:path";
import type { Category, Entry } from "../types/jsonFiles/category.js";
import { createAbsoluteEntryPath } from "../types/jsonFiles/category.js";
import { isGeneralConfigured } from "../types/jsonFiles/settings/general.js";
import type { Settings } from "../types/jsonFiles/settings/index.js";
import type { EnvironmentVariableFunction } from "./applicationsDB.server/types.js";
import { categories } from "./categoriesDB.server/index.js";
import type { SystemId } from "./categoriesDB.server/systemId.js";
import { readCategory } from "./categoryDataCache.server.js";
import { log } from "./debug.server.js";
import { setErrorDialog } from "./errorDialog.server.js";
import { addToLastPlayedCached } from "./lastPlayed.server.js";
import { isWindows } from "./operationsystem.server.js";
import {
  readAdvanced,
  readAppearance,
  readGeneral,
} from "./settings.server.js";
import {
  registerCloseGameOnKeyboardEvent,
  unregisterCloseGameOnKeyboardEvent,
} from "./closeGame.server.js";
import { setGameIsRunningChildProcess } from "./gameIsRunning.server.js";
import { bundledEmulatorsPathBase } from "./bundledEmulatorsPath.server.js";
import {
  createEmuzeFolderIfNotExist,
  syncFromEmulatorFolderToEmuzeFolder,
  syncFromEmuzeFolderToEmulatorFolder,
} from "./syncSettings.server.js";
import { setFocusOnElectronWindow } from "./importElectron.server.js";
import { getRequiredFiles } from "./applicationsDB.server/checkRequiredFiles.js";
import { createRequiredSystemFolderStructure } from "./createSystemFolders.server.js";

type ExecFileCallback = (
  error: ExecFileException | null,
  stdout: string,
  stderr: string,
) => void;

const execFileCallback =
  (reject: (reason: ExecFileException) => void): ExecFileCallback =>
  (error, stdout, stderr) => {
    if (error) {
      log("error", "executeApplication", stderr, error);
      if (
        !isWindows() &&
        error.signal !== "SIGKILL" &&
        error.signal !== "SIGABRT" &&
        error.signal !== "SIGHUP"
      ) {
        reject(error);
      }
    }
    if (stdout && stdout.length > 0) {
      log("debug", stdout);
    }
  };

const executeApplication = (file: string, args: string[]) => {
  return new Promise<void>((resolve, reject) => {
    log("debug", "params", args);
    const childProcess = execFile(
      file,
      args,
      {
        encoding: "utf8",
      },
      execFileCallback(reject),
    );
    setGameIsRunningChildProcess(childProcess);

    registerCloseGameOnKeyboardEvent();

    childProcess.on("close", () => {
      unregisterCloseGameOnKeyboardEvent();

      setTimeout(() => {
        setGameIsRunningChildProcess();
        resolve();
        setFocusOnElectronWindow();
      }, 1000);
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
    nodepath.join(bundledEmulatorsPathBase, bundledPath),
    params,
  );
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
  const applicationData = categoryDB.getApplication();

  if (isGeneralConfigured(generalData) && categoryData && applicationData) {
    const settings: Settings = {
      general: generalData,
      appearance: readAppearance(true),
      advanced: readAdvanced(),
    };

    const systemFolderPath = nodepath.join(
      generalData.categoriesPath,
      categoryData.name,
    );

    const absoluteEntryPath = createAbsoluteEntryPath(
      generalData.categoriesPath,
      categoryData.name,
      entryData.path,
    );

    if (existsSync(absoluteEntryPath)) {
      const {
        defineEnvironmentVariables,
        createOptionParams,
        configFile,
        id,
        bundledPath,
        bundledBiosOpenSource,
        requiredSystemFolderStructure,
      } = applicationData;

      createEmuzeFolderIfNotExist(id, configFile);

      try {
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

        const biosFiles = getRequiredFiles({
          requiredFiles: applicationData.biosFiles,
          systemFolderName: categoryData.name,
          biosPath: generalData.biosPath,
          bundledBiosOpenSource,
        });

        const otherRequiredFiles = getRequiredFiles({
          requiredFiles: applicationData.otherRequiredFiles,
          systemFolderName: categoryData.name,
          biosPath: generalData.biosPath,
          bundledBiosOpenSource,
          allRequired: true,
        });

        createRequiredSystemFolderStructure(
          systemFolderPath,
          requiredSystemFolderStructure,
        );

        const getOptionParams = (applicationPath?: string) =>
          createOptionParams
            ? createOptionParams({
                entryData,
                categoryData,
                settings,
                absoluteEntryPath,
                hasAnalogStick: categoryDB.hasAnalogStick,
                applicationPath,
                biosFiles,
                otherRequiredFiles,
              })
            : [];

        environmentVariables();
        const optionParams = getOptionParams();
        syncFromEmuzeFolderToEmulatorFolder(id, configFile);

        await executeBundledApplication({
          bundledPath,
          absoluteEntryPath,
          optionParams,
          omitAbsoluteEntryPathAsLastParam:
            applicationData.omitAbsoluteEntryPathAsLastParam,
        });

        syncFromEmulatorFolderToEmuzeFolder(id, configFile);
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
        `"${entryData.path}" does not exist anymore`,
      );
      throw new Error();
    }
  }
};
