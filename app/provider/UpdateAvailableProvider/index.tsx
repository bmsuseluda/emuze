import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

export const UpdateAvailableContext = createContext<boolean>(false);

type Props = {
  children: ReactNode;
};

export const UpdateAvailableProvider = ({ children }: Props) => {
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onUpdateAvailable(() => {
        setUpdateAvailable(true);
      });
    }
  }, []);

  return (
    <UpdateAvailableContext value={isUpdateAvailable}>
      {children}
    </UpdateAvailableContext>
  );
};
