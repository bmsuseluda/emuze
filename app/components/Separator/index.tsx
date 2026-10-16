import { styled } from "../../../styled-system/jsx/factory.js";

const Line = styled("span", {
  base: {
    borderBottomStyle: "solid",
    borderBottomColor: "color",
    borderBottomWidth: "0.0625rem",
  },
});

export const Separator = () => <Line />;
