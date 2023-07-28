import "../app/index.css";
import type { Preview } from "@storybook/react";
import { Decorator } from "@storybook/react";

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

const themes = ["red"];
const modes = ["dark", "light"];

const withThemeProvider: Decorator = (Story, context) => {
  const themeName = context.globals.theme;
  const modeName = context.globals.mode;
  return (
    <StoryWrapper data-theme={themeName} data-color-mode={modeName}>
      <div style={{ padding: "2rem" }}>
        <Story {...context} />
      </div>
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
      defaultValue: "red",
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
      defaultValue: "dark",
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
};

export default preview;
