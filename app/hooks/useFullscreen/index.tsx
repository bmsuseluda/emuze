import { useEffect, useState } from "react";

export const useFullscreen = (fullscreenDefault: boolean) => {
  const [fullscreen, setFullscreen] = useState(fullscreenDefault);
  useEffect(() => {
    electronAPI.isFullscreen().then((result: boolean) => {
      if (result) {
        setFullscreen(true);
      }
    });
    electronAPI.onFullscreen((fullscreen) => {
      setFullscreen(fullscreen);
    });
  }, []);

  return fullscreen;
};
