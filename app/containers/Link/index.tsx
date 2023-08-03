import { NavLink } from "@remix-run/react";
import type { ComponentProps } from "react";
import React from "react";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import type { RemixNavLinkProps } from "@remix-run/react/dist/components";
import { styled } from "../../../styled-system/jsx";
import { cva } from "../../../styled-system/css";

type Props = {
  highlightIfActive?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & ComponentProps<"a"> &
  RemixNavLinkProps;

const StyledNavLinkClassName = cva({
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
  },

  variants: {
    active: {
      true: {
        backgroundColor: "accent",
        color: "colorOnAccent",
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
    <NavLink
      to={to}
      prefetch="intent"
      draggable={false}
      className={StyledNavLinkClassName()}
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
    </NavLink>
  ),
);

Link.displayName = "Link";
