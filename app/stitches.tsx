import { createStitches } from "@stitches/react";

export const { getCssText, styled, createTheme, globalCss } = createStitches({
  theme: {
    colors: {
      color: "black",
      backgroundColor: "white",
      sidebarBackgroundColor: "#b3b2b2",
      accent: "#f89b9b",
    },
    space: {
      1: "10px",
      2: "20px",
      3: "30px",
      4: "50px",
    },
    sizes: {
      1: "10px",
      2: "20px",
      3: "30px",
      4: "50px",
    },
    borderWidths: {
      1: "1px",
      2: "2px",
      3: "3px",
    },
    radii: {
      1: "10px",
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
  },
  gradiants: {
    default:
      "linear-gradient(45deg, $colors$backgroundColor, $colors$sidebarBackgroundColor)",
  },
});

const lightTheme = createTheme({});

export const themes = { dark: darkTheme, light: lightTheme };

export const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    // TODO: create typography component
    fontFamily: "arial",
  },
});
