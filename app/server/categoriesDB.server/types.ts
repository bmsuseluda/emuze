import type { Application } from "../applicationsDB.server/types";
import type { SystemId } from "./systemId";

export interface Category {
  id: SystemId;
  names: string[];
  igdbPlatformIds: number[];
  application: Application;
  hasAnalogStick: boolean;
}
