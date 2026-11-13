import type { Application } from "../applicationsDB.server/types.js";
import type { SystemId } from "./systemId.js";
import { SystemSetting } from "../settings.server.js";

export interface Category {
  id: SystemId;
  names: string[];
  igdbPlatformIds: number[];
  getApplication: () => Application;
  hasAnalogStick: boolean;
  settings?: SystemSetting[];
}
