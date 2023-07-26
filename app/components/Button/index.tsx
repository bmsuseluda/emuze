import type { ComponentProps, ReactNode } from "react";
import React, { forwardRef } from "react";
import { IconChildrenWrapper } from "../IconChildrenWrapper";
import { Typography } from "~/components/Typography";
import { styled } from "../../../styled-system/jsx";

export const StyledButton = styled("button", {
  base: {
    borderRounded: true,
    backgroundColor: "backgroundColor",
    color: "color",
    fontWeight: "700",
    borderColor: "sidebarBackgroundColor",
    borderWidth: "2px",
    fontFamily: "inherit",
    fontSize: "80%",
    padding: "0.5rem",
    cursor: "pointer",
    textDecoration: "none",
    outline: "none",
    whiteSpace: "nowrap",

    "&:disabled": {
      borderStyle: "dashed",
      cursor: "not-allowed",
    },
  },
});

export type Props = {
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
} & ComponentProps<"button">;

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, loading = false, icon, ...rest }, ref) => (
    <StyledButton {...rest} ref={ref}>
      <IconChildrenWrapper rotate={loading}>
        {icon}
        <Typography>{children}</Typography>
      </IconChildrenWrapper>
    </StyledButton>
  )
);

Button.displayName = "Button";
