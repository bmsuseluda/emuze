import type { Preview } from "@storybook/react";
import { Decorator } from "@storybook/react";

import { globalStyles, ThemeName, themes } from "~/stitches";
import { Box } from "~/components/Box";

const getColoredDiv = (color: string) => (
  <div
    style={{
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      border: "1px solid black",
      backgroundColor: color,
    }}
  />
);

const withThemeProvider: Decorator = (Story, context) => {
  const themeName = context.globals.theme as ThemeName;
  const theme = themes[themeName];
  globalStyles();
  return (
    <Box
      className={theme}
      css={{
        backgroundColor: "$backgroundColor",
        width: "100%",
        height: "100vh",
        padding: "$2",
        position: "absolute",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Story {...context} />
    </Box>
  );
};

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withThemeProvider],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Theme",
      defaultValue: "dark",
      toolbar: {
        icon: "lightning",
        items: Object.keys(themes).map((themeName) => ({
          value: themeName,
          title: themeName,
          right: getColoredDiv(themeName === "dark" ? "black" : "white"),
        })),
      },
    },
  },
};

export default preview;
