import { styled } from "~/stitches";

export const Button = styled("button", {
  backgroundColor: "$backgroundColor",
  color: "$color",
  border: "2px solid $sidebarBackgroundColor",
  fontWeight: "bold",
  borderRadius: "$1",
  fontSize: "13px",
  padding: "$1 15px",
  cursor: "pointer",
  textDecoration: "none",
  outline: "none",

  "&:focus, &:hover": {
    borderColor: "$color",
  },

  "&:disabled": {
    borderStyle: "dashed",
    cursor: "not-allowed",
  },
});
