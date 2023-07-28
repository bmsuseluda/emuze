import { styled } from "../../../styled-system/jsx";

// TODO: Check if this could be replaced with formrow
export const CheckboxRow = styled("fieldset", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "1",
    padding: "1",
    margin: 0,
    borderRounded: true,
    borderWidth: "1px",
    borderColor: "transparent",

    "&:focus-within": {
      borderColor: "accent",
    },
  },
});
