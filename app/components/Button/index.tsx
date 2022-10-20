import React from "react";
import type { ButtonHTMLAttributes } from "react";
import { styled } from "~/stitches";
import { IconChildrenWrapper } from "../IconChildrenWrapper";

export const StyledButton = styled("button", {
  backgroundColor: "$backgroundColor",
  color: "$color",
  fontWeight: "bold",
  borderWidth: "$2",
  borderStyle: "solid",
  borderColor: "$sidebarBackgroundColor",
  borderRadius: "$1",
  fontSize: "15px",
  padding: "$1",
  cursor: "pointer",
  textDecoration: "none",
  outline: "none",

  "&:focus, &:hover": {
    borderColor: "$color",
  },

  "&:disabled": {
    borderStyle: "dashed",
    cursor: "not-allowed",
  },
});

type Props = {
  icon?: React.ReactNode;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ icon, children, ...rest }, ref) => (
    <StyledButton {...rest} ref={ref}>
      <IconChildrenWrapper icon={icon}>{children}</IconChildrenWrapper>
    </StyledButton>
  )
);

Button.displayName = "Button";
