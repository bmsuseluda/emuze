import "../app/index.css" with { type: "css" };
import type { Decorator, Preview } from "@storybook/react-vite";

import { styled } from "../styled-system/jsx/index.js";

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
      width: "1rem",
      height: "1rem",
      borderRadius: "50%",
      border: "0.0625rem solid black",
      backgroundColor: color,
    }}
  />
);

const themes = ["red"];
const modes = ["dark", "light"];

const withThemeProvider: Decorator = (Story, context) => {
  const themeName = context.globals.theme;
  const modeName = context.globals.mode;
  return (
    <StoryWrapper data-theme={themeName} data-color-mode={modeName}>
      <Story {...context} />
    </StoryWrapper>
  );
};

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
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
      toolbar: {
        title: "Theme",
        icon: "lightning",
        items: themes.map((themeName) => ({
          value: themeName,
          title: themeName,
          right: getColoredDiv(themeName === "red" ? "red" : "white"),
        })),
      },
    },
    mode: {
      description: "Mode",
      toolbar: {
        title: "Mode",
        icon: "lightning",
        items: modes.map((modeName) => ({
          value: modeName,
          title: modeName,
          right: getColoredDiv(modeName === "dark" ? "black" : "white"),
        })),
      },
    },
  },
  initialGlobals: {
    theme: "red",
    mode: "dark",
  },
  tags: ["autodocs"],
};

export default preview;
