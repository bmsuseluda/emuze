import { NavLink } from "@remix-run/react";
import type { AnchorHTMLAttributes } from "react";
import React from "react";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { styled } from "~/stitches";

type Props = {
  to: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const StyledNavLink = styled(NavLink, {
  textDecoration: "none",
  color: "$color",
});

const LinkSpan = styled(IconChildrenWrapper, {
  borderRadius: "$1",
  display: "inline-block",
  width: "100%",
  boxSizing: "border-box",
  padding: "0.5em",
  variants: {
    active: {
      true: {
        backgroundColor: "$accent",
      },
    },
    circle: {
      true: {
        borderRadius: "50%",
      },
    },
  },
});

export const Link = React.forwardRef<HTMLAnchorElement, Props>(
  ({ to, children, icon, ...rest }, ref) => (
    <li>
      <StyledNavLink
        to={to}
        prefetch="intent"
        draggable={false}
        {...rest}
        ref={ref}
      >
        {({ isActive }) => (
          <LinkSpan active={isActive} icon={icon} circle={!!icon && !children}>
            {children}
          </LinkSpan>
        )}
      </StyledNavLink>
    </li>
  )
);

Link.displayName = "Link";
