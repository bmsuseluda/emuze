import type { GeneralConfigured } from "./general";
import type { Appearance } from "./appearance";

export interface Settings {
  general: GeneralConfigured;
  appearance: Appearance;
}
