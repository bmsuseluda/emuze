import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "~/stitches";

export const Label = styled(LabelPrimitive.Root, {
  color: "$color",

  "&:hover": {
    cursor: "pointer",
  },
});
