export const themes = ["dark", "light"] as const;
export type Theme = typeof themes[number];

export type Appearance = {
  theme: Theme;
};

export const defaultAppearance: Appearance = { theme: "dark" };
