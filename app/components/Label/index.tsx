import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "../../../styled-system/jsx/index.js";

export const Label = styled(LabelPrimitive.Root, {
  base: {
    color: "color",

    "&:hover": {
      cursor: "pointer",
    },
  },
});
