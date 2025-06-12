import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

export const FullscreenContext = createContext<boolean>(false);

type Props = {
  fullscreenDefault: boolean;
  children: ReactNode;
};

export const FullscreenProvider = ({
  fullscreenDefault = false,
  children,
}: Props) => {
  const [fullscreen, setFullscreen] = useState(fullscreenDefault);
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.isFullscreen().then((result: boolean) => {
        if (result) {
          setFullscreen(true);
        }
      });
      window.electronAPI.onFullscreen((fullscreen: boolean) => {
        setFullscreen(fullscreen);
      });
    }
  }, []);

  return (
    <FullscreenContext.Provider value={fullscreen}>
      {children}
    </FullscreenContext.Provider>
  );
};
