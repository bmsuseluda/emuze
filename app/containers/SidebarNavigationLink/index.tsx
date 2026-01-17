import { NavLink } from "react-router";
import type { ComponentProps, ReactNode } from "react";
import { IconChildrenWrapper } from "../../components/IconChildrenWrapper/index.js";
import { styled } from "../../../styled-system/jsx/index.js";

interface Props extends ComponentProps<typeof StyledNavLink> {
  isFocused?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const StyledNavLink = styled(NavLink, {
  base: {
    textDecoration: "none",
    color: "color",
    fontSize: "small",
    fontWeight: 500,

    "&:focus": {
      outline: "none",
    },
  },
});

const LinkSpan = styled(IconChildrenWrapper, {
  base: {
    width: "100%",
    boxSizing: "border-box",
    padding: "1rem",
  },

  variants: {
    active: {
      true: {
        backgroundColor: "accent",
        color: "colorOnAccent",
        filter: "grayscale(50%)",
      },
    },
    focused: {
      true: {},
    },
    circle: {
      true: {
        borderRadius: "50%",
        width: "max-content",
        padding: "1",
      },
    },
  },

  compoundVariants: [
    {
      focused: true,
      active: true,
      css: {
        backgroundColor: "accent",
        color: "colorOnAccent",
        filter: "none",
      },
    },
  ],
});

export const SidebarNavigationLink = ({
  to,
  children,
  icon,
  isFocused,
  ...rest
}: Props) => (
  <StyledNavLink to={to} prefetch="intent" draggable={false} {...rest}>
    {({ isActive }) => (
      <LinkSpan
        active={isActive}
        focused={isFocused}
        circle={!!icon && !children}
        iconSize="medium"
      >
        {icon}
        {children}
      </LinkSpan>
    )}
  </StyledNavLink>
);
