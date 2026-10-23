import { styled } from "../../../styled-system/jsx/factory.js";

export const Typography = styled("span", {
  base: {
    textBoxTrim: "trim-both",
  },

  variants: {
    ellipsis: {
      true: {
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
  },
});
