import { styled } from "~/stitches";

const Line = styled("span", {
  borderBottom: "1px solid $color",
});

export const Separator = () => <Line />;
