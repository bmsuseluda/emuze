import { styled } from "../../../styled-system/jsx/index.js";

const Line = styled("span", {
  base: {
    borderBottomStyle: "solid",
    borderBottomColor: "color",
    borderBottomWidth: "1px",
  },
});

export const Separator = () => <Line />;
