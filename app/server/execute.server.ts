import { execFileSync } from "child_process";
import { readCategory } from "~/server/categories.server";
import { getApplicationDataById } from "~/server/applicationsDB.server";
import { readAppearance, readGeneral } from "~/server/settings.server";

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
  optionParams: string[]
) => {
  // TODO: check how to get logs in error case but without freezing the application
  execFileSync(applicationPath, [...optionParams, entryPath]);
};

export const executeApplication = (category: string, entry: string) => {
  const settings = {
    general: readGeneral(),
    appearance: readAppearance(),
  };
  const categoryData = readCategory(category);
  if (categoryData) {
    const {
      applicationId,
      applicationPath,
      applicationFlatpakId,
      applicationFlatpakOptionParams,
      entries,
    } = categoryData;
    const applicationData = getApplicationDataById(applicationId);
    const entryData = entries?.find((value) => value.id === entry);

    if (applicationData && entryData) {
      if (applicationData.environmentVariables) {
        Object.entries(
          applicationData.environmentVariables(categoryData, settings)
        ).forEach(([key, value]) => {
          if (value) {
            process.env[key] = value;
          }
        });
      }
      const optionParams = applicationData.optionParams
        ? applicationData.optionParams(entryData, settings)
        : [];

      try {
        if (applicationPath) {
          executeApplicationOnWindows(
            applicationPath,
            entryData.path,
            optionParams
          );
        } else if (applicationFlatpakId) {
          executeApplicationOnLinux({
            applicationFlatpakOptionParams,
            applicationFlatpakId,
            entryPath: entryData.path,
            optionParams,
          });
        } else {
          throw new Error(
            "There is no valid configuration for the Emulator on your operation system."
          );
        }
      } catch (error) {
        // openErrorDialog(error, `Launch of ${entryData.name} failed`);
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
