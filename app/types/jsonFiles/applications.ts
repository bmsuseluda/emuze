import type { ApplicationId } from "~/server/applicationsDB.server";

export interface Application {
  id: ApplicationId;
  path?: string;
}
