import React from "react";
import type { ButtonHTMLAttributes } from "react";
import type { IconType } from "react-icons";
import { styled } from "~/stitches";

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

  variants: {
    icon: {
      true: {
        display: "flex",
        flexDirection: "row",
        gap: "$1",
        alignItems: "center",
        "> svg": {
          width: "20px",
          height: "20px",
        },
      },
    },
  },
});

type Props = {
  icon?: IconType;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ icon: Icon, children, ...rest }, ref) => (
    <StyledButton icon={!!Icon} {...rest} ref={ref}>
      {Icon && <Icon />} {children}
    </StyledButton>
  )
);

Button.displayName = "Button";
