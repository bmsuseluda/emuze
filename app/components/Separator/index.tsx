import { styled } from "../../../styled-system/jsx/index.js";

const Line = styled("span", {
  base: {
    borderBottomStyle: "solid",
    borderBottomColor: "color",
    borderBottomWidth: "0.0625rem",
  },
});

export const Separator = () => <Line />;
