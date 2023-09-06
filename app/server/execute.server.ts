import { execFile, execFileSync } from "child_process";
import { readCategory } from "~/server/categories.server";
import { getApplicationDataById } from "~/server/applicationsDB.server";
import { readAppearance, readGeneral } from "~/server/settings.server";
import { openErrorDialog } from "~/server/openDialog.server";

// TODO: separate os specific code
const executeApplicationOnLinux = ({
  applicationFlatpakOptionParams,
  applicationFlatpakId,
  entryPath,
  optionParams,
}: {
  applicationFlatpakOptionParams?: string[];
  applicationFlatpakId: string;
  entryPath: string;
  optionParams?: string[];
}) => {
  // TODO: check how to get logs in error case but without freezing the application
  execFileSync("flatpak", [
    "run",
    ...(applicationFlatpakOptionParams ? applicationFlatpakOptionParams : []),
    applicationFlatpakId,
    ...(optionParams ? optionParams : []),
    entryPath,
  ]);
};

const executeApplicationOnWindows = (
  applicationPath: string,
  entryPath: string,
  optionParams: string[],
) => {
  // TODO: check how to get logs in error case but without freezing the application
  execFileSync(applicationPath, [...optionParams, entryPath]);
};

export const executeApplication = (category: string, entry: string) => {
  const generalData = readGeneral();
  const categoryData = readCategory(category);
  if (categoryData?.application && generalData) {
    const settings = {
      general: generalData,
      appearance: readAppearance(),
    };
    const { application, entries } = categoryData;
    const applicationData = getApplicationDataById(application.id);
    const entryData = entries?.find((value) => value.id === entry);

    if (applicationData && entryData) {
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
        ? createOptionParams(entryData, settings)
        : [];

      try {
        if (application.path) {
          executeApplicationOnWindows(
            application.path,
            entryData.path,
            optionParams,
          );
        } else {
          executeApplicationOnLinux({
            applicationFlatpakOptionParams: flatpakOptionParams,
            applicationFlatpakId: flatpakId,
            entryPath: entryData.path,
            optionParams,
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
