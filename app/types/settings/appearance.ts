export const themes = ["dark", "light"] as const;
export type Theme = typeof themes[number];

export type Appearance = {
  theme: Theme;
  applicationsPath?: string;
  categoriesPath?: string;
};
