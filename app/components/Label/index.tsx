import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "../../../styled-system/jsx";

export const Label = styled(LabelPrimitive.Root, {
  base: {
    color: "color",

    "&:hover": {
      cursor: "pointer",
    },
  },
});
