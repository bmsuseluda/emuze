import { styled } from "~/stitches";

export const Typography = styled("span", {
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
});
