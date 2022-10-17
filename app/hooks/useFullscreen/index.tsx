import { useEffect, useState } from "react";

export const useFullscreen = () => {
  const [fullscreen, setFullscreen] = useState(false);
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
