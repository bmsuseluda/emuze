import { styled } from "~/stitches";

export const FormRow = styled("fieldset", {
  display: "flex",
  flexDirection: "column",
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
