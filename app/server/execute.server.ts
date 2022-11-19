import { execFileSync } from "child_process";
import { readCategory } from "~/server/categories.server";
import { getApplicationDataById } from "~/server/applicationsDB.server";
import { openErrorDialog } from "~/server/openDialog.server";
import { readGeneral } from "~/server/settings.server";

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
  execFileSync(applicationPath, [...optionParams, entryPath]);
};

export const executeApplication = (category: string, entry: string) => {
  const generalSettings = readGeneral();
  const categoryData = readCategory(category);
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
        applicationData.environmentVariables(categoryData, generalSettings)
      ).forEach(([key, value]) => {
        if (value) {
          process.env[key] = value;
        }
      });
    }
    const optionParams = applicationData.optionParams
      ? applicationData.optionParams(entryData, generalSettings)
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
      openErrorDialog(error, `Launch of ${entryData.name} failed`);
      console.log("error", error);
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
