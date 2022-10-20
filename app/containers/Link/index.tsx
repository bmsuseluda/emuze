import { NavLink } from "@remix-run/react";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { styled } from "~/stitches";

interface Props {
  to: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const StyledNavLink = styled(NavLink, {
  textDecoration: "none",
  color: "$color",
});

const LinkSpan = styled(IconChildrenWrapper, {
  display: "inline-block",
  width: "100%",
  boxSizing: "border-box",
  padding: "$1",
  variants: {
    active: {
      true: {
        backgroundColor: "$accent",
        borderRadius: "$1",
      },
    },
  },
});

export const Link = ({ to, children, icon, ...rest }: Props) => (
  <li>
    <StyledNavLink to={to} prefetch="intent" draggable={false} {...rest}>
      {({ isActive }) => (
        <LinkSpan active={isActive} icon={icon}>
          {children}
        </LinkSpan>
      )}
    </StyledNavLink>
  </li>
);
