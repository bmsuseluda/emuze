import { Story, StoryContext } from "@storybook/react";

import { globalStyles } from "../app/stitches";
import { Box } from "../app/components/Box";

export const parameters = {
  layout: "fullscreen",
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const withThemeProvider = (Story: Story, context: StoryContext) => {
  globalStyles();
  return (
    <Box
      css={{
        backgroundColor: "$backgroundColor",
        width: "100%",
        height: "100%",
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

export const decorators = [withThemeProvider];
