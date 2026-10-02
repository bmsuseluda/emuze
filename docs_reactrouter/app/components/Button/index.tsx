import type { ComponentProps, ReactNode } from "react";
import { styled } from "../../../../styled-system/jsx/index.js";

export const StyledButton = styled("button", {
  base: {
    borderRounded: true,
    backgroundColor: "backgroundColor",
    color: "color",
    fontWeight: "700",
    borderColor: "sidebarBackgroundColor",
    borderWidth: 2,
    fontFamily: "[inherit]",
    fontSize: "extraSmall",
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

export interface Props extends ComponentProps<typeof StyledButton> {
  children?: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = ({ children, icon, ...rest }: Props) => (
  <StyledButton {...rest}>{children}</StyledButton>
);
