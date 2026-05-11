import { use } from "react";
import { UpdateAvailableContext } from "../../provider/UpdateAvailableProvider/index.js";

export const useUpdateAvailable = () => {
  const context = use(UpdateAvailableContext);
  if (context === undefined) {
    throw new Error(
      "useUpdateAvailable must be used within a UpdateAvailableProvider",
    );
  }

  return context;
};
