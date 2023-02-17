import { styled } from "~/stitches";

export const RoundedBorder = styled("div", {
  borderStyle: "solid",
  borderWidth: "$3",
  borderColor: "$backgroundColor",
  borderRadius: "$1",
  position: "relative",
  overflow: "clip",
});
