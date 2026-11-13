import { ApplicationId } from "../../../server/applicationsDB.server/applicationId.js";
import { SystemId } from "../../../server/categoriesDB.server/systemId.js";

export type SystemSettingsId = "resolution" | "emulator" | "shader";

export type Advanced = Partial<
  Record<SystemId | ApplicationId, Record<SystemSettingsId, string>>
>;
