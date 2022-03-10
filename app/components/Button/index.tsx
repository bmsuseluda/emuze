import { styled } from "~/stitches";

export const Button = styled("button", {
  backgroundColor: "$backgroundColor",
  color: "$color",
  fontWeight: "bold",
  borderWidth: "$2",
  borderStyle: "solid",
  borderColor: "$sidebarBackgroundColor",
  borderRadius: "$1",
  fontSize: "13px",
  padding: "$1 $2",
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
