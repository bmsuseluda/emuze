import { ReactNode } from "react";
import type { Application } from "../applicationsDB.server/types.js";
import type { SystemId } from "./systemId.js";

export interface Option {
  name: string;
  value: string;
}

export interface Setting {
  id: string;
  label: string;
  icon?: ReactNode;
  options: Option[];
}

export interface Category {
  id: SystemId;
  names: string[];
  igdbPlatformIds: number[];
  getApplication: () => Application;
  hasAnalogStick: boolean;
  settings?: Setting[];
}
