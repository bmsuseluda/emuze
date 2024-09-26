import { styled } from "../../../styled-system/jsx";

export const Typography = styled("span", {
  base: {
    _before: {
      content: '""',
      marginBottom: "-0.18em",
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
