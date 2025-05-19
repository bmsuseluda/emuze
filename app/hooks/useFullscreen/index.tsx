import { useContext } from "react";
import { FullscreenContext } from "../../provider/FullscreenProvider/index.js";

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error("useFullscreen must be used within a FullscreenProvider");
  }

  return context;
};
