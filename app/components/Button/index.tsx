import type { ButtonHTMLAttributes, ReactNode } from "react";
import React, { forwardRef } from "react";
import { IconChildrenWrapper } from "../IconChildrenWrapper";
import { Typography } from "~/components/Typography";
import { styled } from "../../../styled-system/jsx";
import type { SystemStyleObject } from "../../../styled-system/types";

const borderRounded: SystemStyleObject = {
  borderStyle: "solid",
  border: "3",
  borderColor: "backgroundColor",
  borderRadius: "1",
  position: "relative",
  overflow: "clip",
};

export const StyledButton = styled("button", {
  base: {
    ...borderRounded,

    // TODO: ask on discord why this does not work
    // borderRounded: true,
    backgroundColor: "backgroundColor",
    color: "color",
    fontWeight: "700",
    border: "2",
    borderColor: "sidebarBackgroundColor",
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
} & ButtonHTMLAttributes<HTMLButtonElement>;

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
