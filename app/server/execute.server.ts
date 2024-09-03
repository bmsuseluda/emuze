import { execFileSync } from "child_process";
import { readCategory } from "./categories.server";
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

// TODO: separate os specific code
const executeApplicationOnLinux = ({
  applicationFlatpakOptionParams,
  applicationFlatpakId,
  absoluteEntryPath,
  optionParams,
  omitAbsoluteEntryPathAsLastParam,
  categoriesPath,
  categoryName,
}: {
  applicationFlatpakOptionParams?: string[];
  applicationFlatpakId: string;
  absoluteEntryPath: string;
  optionParams: string[];
  omitAbsoluteEntryPathAsLastParam?: boolean;
  categoriesPath: string;
  categoryName: string;
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

    execFileSync("flatpak", params);
  } else {
    throw new EmulatorNotInstalledError(categoryName);
  }
};

const executeApplicationOnWindows = ({
  applicationData,
  applicationsPath,
  absoluteEntryPath,
  optionParams,
  omitAbsoluteEntryPathAsLastParam,
  categoryName,
}: {
  applicationData: Application;
  applicationsPath: string;
  absoluteEntryPath: string;
  optionParams: string[];
  omitAbsoluteEntryPathAsLastParam?: boolean;
  categoryName: string;
}) => {
  const applicationPath = getInstalledApplicationForCategoryOnWindows(
    applicationData,
    applicationsPath,
  )?.path;

  if (applicationPath) {
    const params = [];
    params.push(...optionParams);

    if (!omitAbsoluteEntryPathAsLastParam) {
      params.push(absoluteEntryPath);
    }

    execFileSync(applicationPath, params);
  } else {
    throw new EmulatorNotInstalledError(categoryName);
  }
};

const setEnvironmentVariables = ({
  applicationData,
  defineEnvironmentVariables,
  categoryData,
  settings,
}: {
  applicationData: Application;
  defineEnvironmentVariables: EnvironmentVariableFunction;
  categoryData: Category;
  settings: Settings;
}) => {
  const { applicationsPath } = settings.general;
  const applicationPath =
    isWindows() && applicationsPath
      ? getInstalledApplicationForCategoryOnWindows(
          applicationData,
          applicationsPath,
        )?.path
      : undefined;

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

export const executeApplication = (category: SystemId, entryData: Entry) => {
  const generalData = readGeneral();
  const categoryData = readCategory(category);
  const categoryDB = categories[category];
  const applicationData = categoryDB.application;

  if (isGeneralConfigured(generalData) && categoryData && applicationData) {
    const settings: Settings = {
      general: generalData,
      appearance: readAppearance(),
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

      if (defineEnvironmentVariables) {
        setEnvironmentVariables({
          defineEnvironmentVariables,
          categoryData,
          settings,
          applicationData,
        });
      }

      const optionParams = createOptionParams
        ? createOptionParams({
            entryData,
            categoryData,
            settings,
            absoluteEntryPath,
            hasAnalogStick: categoryDB.hasAnalogStick,
          })
        : [];

      try {
        if (isWindows() && generalData.applicationsPath) {
          executeApplicationOnWindows({
            applicationData,
            applicationsPath: generalData.applicationsPath,
            absoluteEntryPath,
            optionParams,
            omitAbsoluteEntryPathAsLastParam:
              applicationData.omitAbsoluteEntryPathAsLastParam,
            categoryName: categoryData.name,
          });
        } else {
          executeApplicationOnLinux({
            applicationFlatpakOptionParams: flatpakOptionParams,
            applicationFlatpakId: flatpakId,
            absoluteEntryPath,
            optionParams,
            omitAbsoluteEntryPathAsLastParam:
              applicationData.omitAbsoluteEntryPathAsLastParam,
            categoriesPath: generalData.categoriesPath,
            categoryName: categoryData.name,
          });
        }

        addToLastPlayedCached(entryData, category);
      } catch (error) {
        log("error", "executeApplication", error);
        if (error instanceof Error) {
          setErrorDialog(`Launch of ${entryData.name} failed`, error.message);
        }
        throw new Error();
      }
    } else {
      setErrorDialog(
        `Launch of ${entryData.name} failed`,
        `${entryData.path} does not exist anymore`,
      );
      throw new Error();
    }
  }
};

export const installFlatpak = (flatpakId: string) => {
  try {
    execFileSync("flatpak", ["install", "--noninteractive", flatpakId]);
    return true;
  } catch (error) {
    log("error", "installFlatpak", error);
    return false;
  }
};
