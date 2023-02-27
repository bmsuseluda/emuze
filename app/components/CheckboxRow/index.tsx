import { styled } from "~/stitches";

// TODO: Check if this could be replaced with formrow
export const CheckboxRow = styled("fieldset", {
  display: "flex",
  alignItems: "center",
  gap: "$1",
  padding: "$1",
  margin: 0,
  roundedBorder: true,
  borderWidth: "$1",
  borderColor: "transparent",

  "&:focus-within": {
    borderColor: "$accent",
  },
});
