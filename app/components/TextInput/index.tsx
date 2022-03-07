import { styled } from "~/stitches";

export const TextInput = styled("input", {
  border: "1px solid $backgroundColor",
  backgroundColor: "$sidebarBackgroundColor",
  color: "$color",
  padding: "$2",
  borderRadius: "$1",
  outline: "none",
  "&:focus, &:hover": {
    border: "1px solid $color",
  },
});
