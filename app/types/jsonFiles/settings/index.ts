import type { GeneralConfigured } from "./general.js";
import type { Appearance } from "./appearance.js";

export interface Settings {
  general: GeneralConfigured;
  appearance: Appearance;
}
