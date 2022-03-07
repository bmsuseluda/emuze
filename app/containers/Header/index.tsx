import { styled } from "~/stitches";
import { Link } from "remix";
import { Ul } from "~/components/Ul";

const StyledHeader = styled("header", {
  borderBottom: "1px solid $color",
});

const StyledLink = styled(Link, {
  textDecoration: "none",
  color: "$color",
});

export const Header = () => (
  <StyledHeader>
    <nav aria-label="Main navigation">
      <Ul>
        <li>
          <StyledLink to="/">Library</StyledLink>
        </li>
        <li>
          <StyledLink to="/settings">Settings</StyledLink>
        </li>
      </Ul>
    </nav>
  </StyledHeader>
);
