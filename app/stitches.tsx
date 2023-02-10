import { createStitches } from "@stitches/react";

export const { getCssText, styled, createTheme, globalCss } = createStitches({
  theme: {
    colors: {
      color: "black",
      backgroundColor: "white",
      sidebarBackgroundColor: "#b3b2b2",
      accent: "#f89b9b",
      error: "#950909",
    },
    space: {
      1: "0.8rem",
      2: "2rem",
      3: "3rem",
      4: "5rem",
    },
    sizes: {
      1: "1rem",
      2: "2rem",
      3: "3rem",
      4: "4rem",
      5: "5rem",
    },
    borderWidths: {
      1: "1px",
      2: "2px",
      3: "4px",
    },
    radii: {
      1: "0.8rem",
    },
    gradiants: {
      default:
        "linear-gradient(45deg, $colors$backgroundColor, $colors$sidebarBackgroundColor)",
    },
  },
});

const darkTheme = createTheme({
  colors: {
    color: "white",
    backgroundColor: "black",
    sidebarBackgroundColor: "#4d4d4d",
    accent: "#950909",
    error: "#950909",
  },
  gradiants: {
    default:
      "linear-gradient(45deg, $colors$backgroundColor, $colors$sidebarBackgroundColor)",
  },
});

const lightTheme = createTheme({});

export type ThemeName = keyof typeof themes;

export const themes = { dark: darkTheme, light: lightTheme };

export const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    // TODO: create typography component
    fontFamily: "arial",
    userSelect: "none",
  },
});
