import "../app/index.css";
// TODO: fix storybook with panda
import type { Preview } from "@storybook/react";
import { Decorator } from "@storybook/react";

import { ThemeName, themes } from "~/stitches";
import { styled } from "../styled-system/jsx";

const StoryWrapper = styled("div", {
  base: {
    backgroundColor: "backgroundColor",
    padding: "2",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
});

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
  return (
    <StoryWrapper>
      <Story {...context} />
    </StoryWrapper>
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
    backgrounds: {
      disable: true,
    },
  },
  decorators: [withThemeProvider],
  globalTypes: {
    theme: {
      description: "Theme",
      defaultValue: "dark",
      toolbar: {
        title: "Theme",
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
