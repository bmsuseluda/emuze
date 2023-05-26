import type { ButtonHTMLAttributes, ReactNode } from "react";
import React, { forwardRef } from "react";
import { styled } from "~/stitches";
import { IconChildrenWrapper } from "../IconChildrenWrapper";

export const StyledButton = styled("button", {
  backgroundColor: "$backgroundColor",
  color: "$color",
  fontWeight: "bold",
  roundedBorder: true,
  borderWidth: "$2",
  borderColor: "$sidebarBackgroundColor",
  fontFamily: "inherit",
  fontSize: "90%",
  padding: "0.5rem",
  cursor: "pointer",
  textDecoration: "none",
  outline: "none",
  whiteSpace: "nowrap",

  "&:disabled": {
    borderStyle: "dashed",
    cursor: "not-allowed",
  },
});

export type Props = {
  children: ReactNode;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, loading = false, ...rest }, ref) => (
    <StyledButton {...rest} ref={ref}>
      <IconChildrenWrapper rotate={loading}>{children}</IconChildrenWrapper>
    </StyledButton>
  )
);

Button.displayName = "Button";
