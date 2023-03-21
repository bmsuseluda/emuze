import type { ButtonHTMLAttributes } from "react";
import React from "react";
import { styled } from "~/stitches";
import { IconChildrenWrapper } from "../IconChildrenWrapper";

export const StyledButton = styled("button", {
  backgroundColor: "$backgroundColor",
  color: "$color",
  fontWeight: "bold",
  roundedBorder: true,
  borderWidth: "$2",
  borderColor: "$sidebarBackgroundColor",
  fontSize: "15px",
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

type Props = {
  icon?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ icon, children, loading = false, ...rest }, ref) => (
    <StyledButton {...rest} ref={ref}>
      <IconChildrenWrapper icon={icon} rotate={loading}>
        {children}
      </IconChildrenWrapper>
    </StyledButton>
  )
);

Button.displayName = "Button";
