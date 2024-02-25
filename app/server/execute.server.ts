import { execFile, execFileSync } from "child_process";
import { readCategory } from "~/server/categories.server";
import { applications } from "~/server/applicationsDB.server";
import { readAppearance, readGeneral } from "~/server/settings.server";
import { openErrorDialog } from "~/server/openDialog.server";
import { createAbsoluteEntryPath } from "~/types/jsonFiles/category";
import { isGeneralConfigured } from "~/types/jsonFiles/settings/general";
import { isApplicationWindows } from "~/types/jsonFiles/applications";

// TODO: separate os specific code
const executeApplicationOnLinux = ({
  applicationFlatpakOptionParams,
  applicationFlatpakId,
  absoluteEntryPath,
  optionParams,
  omitAbsoluteEntryPathAsLastParam,
}: {
  applicationFlatpakOptionParams?: string[];
  applicationFlatpakId: string;
  absoluteEntryPath: string;
  optionParams: string[];
  omitAbsoluteEntryPathAsLastParam?: boolean;
}) => {
  const params = ["run"];
  if (applicationFlatpakOptionParams) {
    params.push(...applicationFlatpakOptionParams);
  }
  params.push(applicationFlatpakId);
  params.push(...optionParams);

  if (!omitAbsoluteEntryPathAsLastParam) {
    params.push(absoluteEntryPath);
  }

  // TODO: check how to get logs in error case but without freezing the application
  execFileSync("flatpak", params);
};

const executeApplicationOnWindows = ({
  applicationPath,
  absoluteEntryPath,
  optionParams,
  omitAbsoluteEntryPathAsLastParam,
}: {
  applicationPath: string;
  absoluteEntryPath: string;
  optionParams: string[];
  omitAbsoluteEntryPathAsLastParam?: boolean;
}) => {
  const params = [];
  params.push(...optionParams);

  if (!omitAbsoluteEntryPathAsLastParam) {
    params.push(absoluteEntryPath);
  }
  // TODO: check how to get logs in error case but without freezing the application
  execFileSync(applicationPath, params);
};

export const executeApplication = (category: string, entry: string) => {
  const generalData = readGeneral();
  const categoryData = readCategory(category);
  if (categoryData?.application && isGeneralConfigured(generalData)) {
    const settings = {
      general: generalData,
      appearance: readAppearance(),
    };
    const { application, entries } = categoryData;
    const applicationData = applications[application.id];
    const entryData = entries?.find((value) => value.id === entry);

    if (applicationData && entryData) {
      const absoluteEntryPath = createAbsoluteEntryPath(
        generalData.categoriesPath,
        categoryData.name,
        entryData.path,
      );

      const {
        environmentVariables,
        createOptionParams,
        flatpakId,
        flatpakOptionParams,
      } = applicationData;

      if (environmentVariables) {
        Object.entries(environmentVariables(categoryData, settings)).forEach(
          ([key, value]) => {
            if (value) {
              process.env[key] = value;
            }
          },
        );
      }
      const optionParams = createOptionParams
        ? createOptionParams({
            entryData,
            categoryData,
            settings,
            absoluteEntryPath,
          })
        : [];

      try {
        // TODO: check on isWindows
        if (isApplicationWindows(application)) {
          executeApplicationOnWindows({
            applicationPath: application.path,
            absoluteEntryPath,
            optionParams,
            omitAbsoluteEntryPathAsLastParam:
              applicationData.omitAbsoluteEntryPathAsLastParam,
          });
        } else {
          executeApplicationOnLinux({
            applicationFlatpakOptionParams: flatpakOptionParams,
            applicationFlatpakId: flatpakId,
            absoluteEntryPath,
            optionParams,
            omitAbsoluteEntryPathAsLastParam:
              applicationData.omitAbsoluteEntryPathAsLastParam,
          });
        }
      } catch (error) {
        openErrorDialog(error, `Launch of ${entryData.name} failed`);
        console.log("error", error);
      }
    }
  }
};

export const checkFlatpakIsInstalled = (flatpakId: string) => {
  try {
    execFileSync("flatpak", ["info", flatpakId]);
    return true;
  } catch (error) {
    return false;
  }
};
export const checkFlatpakIsInstalledParallel = (flatpakId: string) =>
  new Promise<boolean>((resolve, reject) => {
    execFile("flatpak", ["info", flatpakId], (error, stdout) => {
      if (error) {
        reject(true);
      }
      if (stdout) {
        resolve(true);
      }
    });
  });

export const installFlatpak = (flatpakId: string) => {
  try {
    execFileSync("flatpak", ["install", "--noninteractive", flatpakId]);
    return true;
  } catch (error) {
    return false;
  }
};
