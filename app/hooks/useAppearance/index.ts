import { use } from "react";
import { AppearanceContext } from "../../provider/AppearanceProvider/index.js";

export const useAppearance = () => {
  const context = use(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within a AppearanceProvider");
  }

  return context;
};
