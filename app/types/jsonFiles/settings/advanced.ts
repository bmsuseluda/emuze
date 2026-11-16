import { ApplicationId } from "../../../server/applicationsDB.server/applicationId.js";
import { SystemId } from "../../../server/categoriesDB.server/systemId.js";

export type SystemSettingsId =
  | "resolution"
  | "emulator"
  | "shader"
  | "perspectiveCorrection"
  | "ntscTimings"
  | "screenLayout";

export type AdvancedSettings = Partial<Record<SystemSettingsId, string>>;

export type Advanced = Partial<
  Record<SystemId | `${SystemId}/${ApplicationId}`, AdvancedSettings>
>;
