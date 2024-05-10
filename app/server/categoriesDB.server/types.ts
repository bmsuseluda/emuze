import type { Application } from "../applicationsDB.server/types";
import type { SystemId } from "./systemId";

export interface Category {
  id: SystemId;
  names: string[];
  igdbPlatformIds: number[];
  applications: Application[];
  defaultApplication: Application;
  hasAnalogStick: boolean;
}
