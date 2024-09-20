import { NavLink } from "@remix-run/react";
import type { ElementRef, ReactNode } from "react";
import { forwardRef } from "react";
import { IconChildrenWrapper } from "../../components/IconChildrenWrapper";
import type { RemixNavLinkProps } from "@remix-run/react/dist/components";
import { styled } from "../../../styled-system/jsx";

interface Props extends RemixNavLinkProps {
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
    borderRadius: "1",
    width: "100%",
    boxSizing: "border-box",
    padding: "0.5em",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "transparent",
  },

  variants: {
    active: {
      true: {
        borderColor: "color",
      },
    },
    focused: {
      true: {},
    },
    circle: {
      true: {
        borderRadius: "50%",
        width: "max-content",
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
        borderColor: "accent",
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
