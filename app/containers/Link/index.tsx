import { NavLink } from "remix";
import { styled } from "~/stitches";

interface Props {
  to: string;
  children: React.ReactNode;
}

const StyledNavLink = styled(NavLink, {
  textDecoration: "none",
  color: "$color",
});

const ActiveLinkSpan = styled("span", {
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

export const Link = ({ to, children, ...rest }: Props) => (
  <li>
    <StyledNavLink to={to} prefetch="intent" draggable={false} {...rest}>
      {({ isActive }) => (
        <ActiveLinkSpan active={isActive}>{children}</ActiveLinkSpan>
      )}
    </StyledNavLink>
  </li>
);
