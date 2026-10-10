import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "../../../styled-system/jsx/factory.js";

export const Label = styled(LabelPrimitive.Root, {
  base: {
    color: "color",
    fontSize: "small",

    "&:hover": {
      cursor: "pointer",
    },
  },
});
