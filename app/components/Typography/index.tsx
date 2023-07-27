import { styled } from "../../../styled-system/jsx";

export const Typography = styled("span", {
  base: {
    "&::before": {
      content: "",
      marginBottom: "-0.05em",
      display: "table",
    },
    "&::after": {
      content: "",
      marginTop: "0",
      display: "table",
    },
  },
});
