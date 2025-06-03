import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from "react";
import { forwardRef } from "react";
import { IconChildrenWrapper } from "../IconChildrenWrapper/index.js";
import { Typography } from "../Typography/index.js";
import { styled } from "../../../styled-system/jsx/index.js";

export const StyledButton = styled("button", {
  base: {
    borderRounded: true,
    backgroundColor: "backgroundColor",
    color: "color",
    fontWeight: "700",
    borderColor: "sidebarBackgroundColor",
    borderWidth: 2,
    fontFamily: "[inherit]",
    fontSize: "[80%]",
    padding: "[0.5rem 1rem]",
    cursor: "pointer",
    textDecoration: "[none]",
    outline: "[none]",
    whiteSpace: "nowrap",

    "&:disabled": {
      borderStyle: "dashed",
      cursor: "not-allowed",
    },

    "&:focus-visible": {
      borderColor: "accent",
    },
  },
});

export interface Props extends ComponentPropsWithoutRef<typeof StyledButton> {
  children?: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<ElementRef<typeof StyledButton>, Props>(
  ({ children, loading = false, icon, ...rest }, ref) => (
    <StyledButton {...rest} ref={ref}>
      <IconChildrenWrapper rotate={loading}>
        {icon}
        {children && <Typography>{children}</Typography>}
      </IconChildrenWrapper>
    </StyledButton>
  ),
);

Button.displayName = "Button";
