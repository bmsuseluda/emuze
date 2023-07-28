import { defineConfig, defineGlobalStyles } from "@pandacss/dev";
import type { PropertyTransform } from "@pandacss/types";

const globalCss = defineGlobalStyles({
  body: {
    margin: 0,
    padding: 0,

    fontWeight: 400,
    fontFamily: "quicksandLight",
    fontSize: "130%",

    userSelect: "none",
  },
});

const borderRoundedTransform: PropertyTransform = (
  value: boolean,
  { token }
) => {
  if (value) {
    return {
      borderRadius: token("radii.1"),
      position: "relative",
      overflow: "clip",
    };
  }
  return {};
};

export default defineConfig({
  preflight: true,

  jsxFramework: "react",

  outExtension: "js",
  include: ["./app/**/*.{ts,tsx}"],

  exclude: [],

  globalCss,

  conditions: {
    light: "[data-color-mode=light] &",
    dark: "[data-color-mode=dark] &",
    redTheme: "[data-theme=red] &",
  },

  theme: {
    semanticTokens: {
      colors: {
        color: {
          value: {
            _redTheme: { _dark: "white", _light: "black" },
          },
        },
        backgroundColor: {
          value: {
            _redTheme: { _dark: "black", _light: "white" },
          },
        },
        transparentBackgroundColor: {
          value: {
            _redTheme: {
              _dark: "rgba(0, 0, 0, 0.6)",
              _light: "rgba(0, 0, 0, 0.6)",
            },
          },
        },
        sidebarBackgroundColor: {
          value: {
            _redTheme: {
              _dark: "#4d4d4d",
              _light: "#b3b2b2",
            },
          },
        },
        accent: {
          value: {
            _redTheme: {
              _dark: "#950909",
              _light: "#950909",
            },
          },
        },
        colorOnAccent: {
          value: {
            _redTheme: {
              _dark: "white",
              _light: "white",
            },
          },
        },
        error: {
          value: {
            _redTheme: {
              _dark: "#da1616",
              _light: "#950909",
            },
          },
        },
      },
      gradients: {
        default: {
          value: {
            _redTheme: {
              _dark:
                "linear-gradient(45deg, {colors.backgroundColor}, {colors.sidebarBackgroundColor})",
              _light:
                "linear-gradient(45deg, {colors.backgroundColor}, {colors.sidebarBackgroundColor})",
            },
          },
        },
      },
    },
    tokens: {
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
      fonts: {
        quicksandLight: {
          value: "var(--font-quicksand-light)",
        },
      },
    },

    extend: {
      keyframes: {
        scaleUp: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        makeOpaque: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },

  utilities: {
    extend: {
      borderRounded: {
        className: "borderRounded",
        values: { type: "boolean" },
        transform: borderRoundedTransform,
      },
    },
  },

  outdir: "styled-system",
});
