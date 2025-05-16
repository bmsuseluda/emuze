import { NavLink, NavLinkProps } from "react-router";
import type { ElementRef, ReactNode } from "react";
import { forwardRef } from "react";
import { IconChildrenWrapper } from "../../components/IconChildrenWrapper";
import { styled } from "../../../styled-system/jsx";

interface Props extends NavLinkProps {
  isFocused?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const StyledNavLink = styled(NavLink, {
  base: {
    textDecoration: "none",
    color: "color",
    fontSize: "90%",
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

    "& > svg": {
      minHeight: "max(25px, 1.2em)",
      minWidth: "max(25px, 1.2em)",
    },
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

export const Link = forwardRef<ElementRef<typeof StyledNavLink>, Props>(
  ({ to, children, icon, isFocused, ...rest }, ref) => (
    <StyledNavLink
      to={to}
      prefetch="intent"
      draggable={false}
      {...rest}
      ref={ref}
    >
      {({ isActive }) => (
        <LinkSpan
          active={isActive}
          focused={isFocused}
          circle={!!icon && !children}
        >
          {icon}
          {children}
        </LinkSpan>
      )}
    </StyledNavLink>
  ),
);

Link.displayName = "Link";
