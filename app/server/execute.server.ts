import { execFileSync } from "child_process";
import { readCategory } from "~/server/categories.server";
import { getApplicationData } from "./applicationsDB.server";

// TODO: add tests for optionalParams and environment variables
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
      console.log("error", error);
    }
  }
};
