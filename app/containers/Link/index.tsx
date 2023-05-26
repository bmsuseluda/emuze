import { NavLink } from "@remix-run/react";
import type { AnchorHTMLAttributes } from "react";
import React from "react";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { styled } from "~/stitches";
import type { RemixNavLinkProps } from "@remix-run/react/dist/components";

type Props = {
  highlightIfActive?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement> &
  RemixNavLinkProps;

const StyledNavLink = styled(NavLink, {
  textDecoration: "none",
  color: "$color",

  "&:focus": {
    outline: "none",
  },
});

const LinkSpan = styled(IconChildrenWrapper, {
  borderRadius: "$1",
  width: "100%",
  boxSizing: "border-box",
  padding: "0.5em",

  variants: {
    active: {
      true: {
        backgroundColor: "$accent",
        color: "$colorOnAccent",
      },
    },
    circle: {
      true: {
        borderRadius: "50%",
        width: "max-content",
      },
    },
  },
});

export const Link = React.forwardRef<HTMLAnchorElement, Props>(
  ({ to, children, icon, highlightIfActive = true, ...rest }, ref) => (
    <StyledNavLink
      to={to}
      prefetch="intent"
      draggable={false}
      {...rest}
      ref={ref}
    >
      {({ isActive }) => (
        <LinkSpan
          active={isActive && highlightIfActive}
          circle={!!icon && !children}
        >
          {icon}
          {children}
        </LinkSpan>
      )}
    </StyledNavLink>
  )
);

Link.displayName = "Link";
