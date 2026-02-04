import { styled } from "../../../styled-system/jsx/index.js";

export const FormRow = styled("fieldset", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    paddingTop: "1",
    paddingRight: "1",
    paddingBottom: "1",
    paddingLeft: "0",
    margin: 0,
    borderRounded: true,
    borderWidth: "1",
    borderColor: "transparent",
  },
});
