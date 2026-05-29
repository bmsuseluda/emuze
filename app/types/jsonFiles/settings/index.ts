import type { GeneralConfigured } from "./general.js";
import type { Appearance } from "./appearance.js";
import type { Advanced } from "./advanced.js";

export interface Settings {
  general: GeneralConfigured;
  appearance: Appearance;
  advanced: Advanced;
}
