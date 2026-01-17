import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "../../../styled-system/jsx/index.js";

export const CheckboxLabel = styled(LabelPrimitive.Root, {
  base: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "1",
    margin: 0,
    width: "fit-content",
    outlineRounded: true,
    outlineWidth: "0.125rem",
    outlineStyle: "solid",
    outlineOffset: 1,
    outlineColor: "transparent",
    color: "color",
    fontSize: "small",

    "&:hover": {
      cursor: "pointer",
    },

    "&:has(:focus-visible)": {
      outlineColor: "accent",
    },
  },
});
