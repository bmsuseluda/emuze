import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  jsxFramework: "react",

  // The extension for the emitted JavaScript files
  outExtension: "js",
  // Where to look for your css declarations
  include: ["./app/**/*.{ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    tokens: {
      colors: {
        color: { value: "white" },
        backgroundColor: { value: "black" },
        transparentBackgroundColor: { value: "rgba(0, 0, 0, 0.6)" },
        sidebarBackgroundColor: { value: "#4d4d4d" },
        accent: { value: "#950909" },
        colorOnAccent: { value: "white" },
        error: { value: "#da1616" },
      },
      spacing: {
        1: { value: "0.8rem" },
        2: { value: "2rem" },
        3: { value: "3rem" },
        4: { value: "5rem" },
      },
      sizes: {
        1: { value: "1rem" },
        2: { value: "2rem" },
        3: { value: "3rem" },
        4: { value: "4rem" },
        5: { value: "5rem" },
      },
      borders: {
        2: {
          value: "2px solid black",
        },
        3: {
          value: "4px solid black",
        },
      },
      // TODO: check how to define them
      // borderWidths: {
      //   1: "1px",
      //   2: "2px",
      //   3: "4px",
      // },
      radii: {
        1: { value: "0.8rem" },
      },
      gradients: {
        default: {
          value:
            "linear-gradient(45deg, $colors$backgroundColor, $colors$sidebarBackgroundColor)",
        },
      },
    },
  },

  utilities: {
    extend: {
      borderRounded: {
        className: "borderRounded",
        values: "boolean",
        transform: () => ({
          borderStyle: "solid",
          border: "3",
          borderColor: "backgroundColor",
          borderRadius: "1",
          position: "relative",
          overflow: "clip",
        }),
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
