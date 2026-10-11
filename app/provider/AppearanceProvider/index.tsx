import { createContext, ReactNode } from "react";
import { Appearance } from "../../types/jsonFiles/settings/appearance.js";

const defaultState: Appearance = {
  alwaysGameNames: false,
  collapseSidebar: false,
  fullscreen: false,
};

export const AppearanceContext = createContext<Appearance>(defaultState);

interface Props {
  children: ReactNode;
  appearance: Appearance;
}

export const AppearanceProvider = ({ children, appearance }: Props) => (
  <AppearanceContext value={appearance}>{children}</AppearanceContext>
);
