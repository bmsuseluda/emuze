import { GiCheckMark } from "react-icons/gi";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { styled } from "../../../styled-system/jsx/index.js";

const Wrapper = styled("div", {
  base: {
    backgroundColor: "backgroundColor",
    borderWidth: 2,
    borderRadius: 4,
    borderColor: "accent",
    outline: "[none]",
    width: 2,
    height: 2,

    "&:has(*:checked)": {
      backgroundColor: "accent",
    },
  },
});

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    outline: "none",
    cursor: "pointer",
  },
});

const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
  base: {
    color: "color",
    width: "100%",
    height: "100%",
    padding: "2px",
    boxSizing: "border-box",
  },
});

const Checkmark = styled(GiCheckMark, {
  base: {
    width: "100%",
    height: "100%",
    color: "backgroundColor",
  },
});

export const Checkbox = forwardRef<
  ElementRef<typeof StyledCheckbox>,
  ComponentPropsWithoutRef<typeof StyledCheckbox>
>((props, ref) => (
  <Wrapper>
    <StyledCheckbox {...props} ref={ref}>
      <StyledIndicator>
        <Checkmark />
      </StyledIndicator>
    </StyledCheckbox>
  </Wrapper>
));

Checkbox.displayName = "Checkbox";
