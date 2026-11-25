import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "../../../styled-system/jsx/factory.js";

export const Label = styled(LabelPrimitive.Root, {
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1",
    margin: 0,
    outlineRounded: true,
    outline: "outlineInitial",
    outlineOffset: 1,
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
