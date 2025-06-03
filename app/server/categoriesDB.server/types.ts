import type { Application } from "../applicationsDB.server/types.js";
import type { SystemId } from "./systemId.js";

export interface Category {
  id: SystemId;
  names: string[];
  igdbPlatformIds: number[];
  application: Application;
  hasAnalogStick: boolean;
}
