import { styled } from "../../../styled-system/jsx";

export const Typography = styled("span", {
  base: {
    _before: {
      content: '""',
      marginBottom: "-0.05em",
      display: "table",
    },
    _after: {
      content: '""',
      marginTop: "-0.1em",
      display: "table",
    },
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
