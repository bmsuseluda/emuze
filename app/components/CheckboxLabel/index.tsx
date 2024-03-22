import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "../../../styled-system/jsx";

export const CheckboxLabel = styled(LabelPrimitive.Root, {
  base: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "1",
    padding: 1,
    margin: 0,
    borderRounded: true,
    borderWidth: "1px",
    borderColor: "transparent",
    color: "color",

    "&:hover": {
      cursor: "pointer",
    },

    "&:focus-within": {
      borderColor: "accent",
    },
  },
});
