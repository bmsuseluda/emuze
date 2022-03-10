import { styled } from "~/stitches";

export const TextInput = styled("input", {
  borderStyle: "solid",
  borderWidth: "$2",
  borderColor: "$backgroundColor",
  backgroundColor: "$sidebarBackgroundColor",
  color: "$color",
  padding: "$1",
  borderRadius: "$1",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  "&:focus": {
    borderColor: "$color",
  },
  "&:invalid": {
    borderColor: "$error",
    borderStyle: "dashed",
  },
});
