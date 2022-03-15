import { styled } from "~/stitches";
import { Link } from "remix";
import { IoMdSettings } from "react-icons/io";

import { Ul as BaseUl } from "~/components/Ul";

const StyledHeader = styled("header", {
  borderBottom: "1px solid $color",
  padding: "$1 $1 $1 0",
});

const StyledLink = styled(Link, {
  textDecoration: "none",
  color: "$color",
});

const Ul = styled(BaseUl, {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

export const Header = () => (
  <StyledHeader>
    <nav aria-label="Main navigation">
      <Ul>
        <li>
          <StyledLink to="/">Library</StyledLink>
        </li>
        <li>
          <StyledLink to="/settings">
            <IoMdSettings />
          </StyledLink>
        </li>
      </Ul>
    </nav>
  </StyledHeader>
);
