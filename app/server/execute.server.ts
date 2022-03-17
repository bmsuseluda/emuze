import { execFileSync } from "child_process";
import { readCategory } from "~/server/categories.server";
import { getApplicationData } from "~/server/applicationsDB.server";
import { openErrorDialog } from "~/server/openDialog.server";

export const executeApplication = (category: string, entry: string) => {
  const categoryData = readCategory(category);
  const { applicationId, applicationPath, entries } = categoryData;
  const applicationData = getApplicationData(applicationId);
  const entryData = entries?.find((value) => value.id === entry);

  if (applicationData && entryData) {
    if (applicationData.environmentVariables) {
      Object.entries(
        applicationData.environmentVariables(categoryData)
      ).forEach(([key, value]) => {
        process.env[key] = value;
      });
    }
    const optionParams = applicationData.optionParams
      ? applicationData.optionParams(entryData)
      : [];

    try {
      execFileSync(applicationPath, [...optionParams, entryData.path]);
    } catch (error) {
      openErrorDialog(error, `Launch of ${entryData.name} failed`);
      console.log("error", error);
    }
  }
};
