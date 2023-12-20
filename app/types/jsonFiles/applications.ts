import type { Required } from "utility-types";
import type { ApplicationId } from "~/server/applicationsDB.server";

export interface Application {
  id: ApplicationId;
  path?: string;
}

export type ApplicationWindows = Required<Application, "path">;

export const isApplicationWindows = (
  application: Application,
): application is ApplicationWindows => !!application.path;
