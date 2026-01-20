import { defineConfig, defineGlobalStyles, defineUtility } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  html: {
    overflow: "hidden",
    fontSize: "100%",

    "@media (min-width: 2560px)": {
      fontSize: "150%",
    },
    "@media (min-width: 3300px)": {
      fontSize: "175%",
    },
  },
  body: {
    margin: 0,
    padding: 0,

    fontWeight: 400,
    fontFamily: "quicksandLight",

    userSelect: "none",

    interpolateSize: "allow-keywords",
    overflow: "inherit",
  },
});

const borderRounded = defineUtility({
  className: "borderRounded",
  values: { type: "boolean" },
  transform: (value: boolean, { token }) => {
    if (value) {
      return {
        borderRadius: token("radii.1"),
        position: "relative",
      };
    }
    return {};
  },
});

const outlineRounded = defineUtility({
  className: "outlineRounded",
  values: { type: "boolean" },
  transform: (value: boolean, { token }) => {
    if (value) {
      return {
        borderRadius: token("radii.outline"),
        position: "relative",
      };
    }
    return {};
  },
});

export default defineConfig({
  forceConsistentTypeExtension: true,
  preflight: true,
  eject: true,
  // strictTokens: true,
  strictPropertyValues: true,
  presets: ["@pandacss/preset-base"],
  jsxFramework: "react",
  jsxStyleProps: "none",
  outExtension: "js",
  watch: process.env.NODE_ENV !== "production",
  minify: process.env.NODE_ENV === "production",
  hash: process.env.NODE_ENV === "production",
  include: ["./app/**/*.{ts,tsx}", "./.storybook/preview.tsx"],
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
                "linear-gradient(45deg, {colors.backgroundColor} 10%, {colors.sidebarBackgroundColor})",
              _light:
                "linear-gradient(45deg, {colors.backgroundColor} 10%, {colors.sidebarBackgroundColor})",
            },
          },
        },
      },
      spacing: {
        outlinePadding: { value: "1rem" },
        // If you change this value, change it in customRoutes/categories.$category.tsx as well
        scrollPadding: { value: "50% 0" },
      },
      sizes: {
        scrollMask: { value: "1.5rem" },
        iconExtraSmall: { value: "{sizes.1}" },
        iconSmall: { value: "1.25rem" },
        iconMedium: { value: "1.5rem" },
        iconLarge: { value: "2.5rem" },
      },
      shadows: {
        dialog: {
          value: "0 0 1.25rem 0.625rem black",
        },
      },
    },
    tokens: {
      spacing: {
        1: { value: "0.75rem" },
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
        200: { value: "12.5rem" },
        300: { value: "18.75rem" },
      },
      fontSizes: {
        extraSmall: { value: "1.125rem" },
        small: { value: "1.25rem" },
        medium: { value: "1.5rem" },
        large: { value: "2rem" },
        extraLarge: { value: "4rem" },
      },
      borders: {
        2: {
          value: "0.125rem solid black",
        },
        3: {
          value: "0.25rem solid black",
        },
        outlineInitial: {
          value: "0.125rem solid transparent",
        },
      },
      borderWidths: {
        1: { value: "0.0625rem" },
        2: { value: "0.125rem" },
        3: { value: "0.25rem" },
      },
      radii: {
        outline: { value: "0.125rem" },
        1: { value: "0.75rem" },
      },
      fonts: {
        quicksandLight: {
          value: "var(--font-quicksand-light)",
        },
        annieUseYourTelescope: {
          value: "var(--font-annie-use-your-telescope)",
        },
      },
    },

    extend: {
      keyframes: {
        scaleUp: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        makeOpaque: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        focused: {
          "0%": { outlineColor: "accent" },
          "33%": { outlineColor: "accent" },
          "66%": { outlineColor: "white" },
          "75%": { outlineColor: "white" },
          "100%": { outlineColor: "accent" },
        },
        pulse: {
          "0%": { filter: "brightness(80%)" },
          "50%": { transform: "scale(1.2)", filter: "brightness(100%)" },
          "100%": { filter: "brightness(80%)" },
        },
      },
    },
  },

  utilities: {
    extend: {
      borderRounded,
      outlineRounded,
    },
  },

  outdir: "styled-system",
});
