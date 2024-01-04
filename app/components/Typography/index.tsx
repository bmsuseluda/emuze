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
      marginTop: "0",
      display: "table",
    },
  },
});
