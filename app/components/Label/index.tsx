import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "../../../styled-system/jsx/index.js";

export const Label = styled(LabelPrimitive.Root, {
  base: {
    color: "color",
    fontSize: "small",

    "&:hover": {
      cursor: "pointer",
    },
  },
});
