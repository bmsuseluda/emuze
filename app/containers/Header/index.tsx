import { Link } from "@remix-run/react";
import { IoMdSettings } from "react-icons/io";
import { IoLibrarySharp } from "react-icons/io5";
import { styled } from "~/stitches";

import { Ul } from "~/components/Ul";

const Headline = styled("h1", {
  margin: 0,
  padding: 0,
});

const StyledNav = styled("nav", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

const StyledHeader = styled("header", {
  borderBottom: "1px solid $color",
  padding: "$1 $1 $1 0",
});

const StyledLink = styled(Link, {
  textDecoration: "none",
  color: "$color",

  "> svg": {
    width: "20px",
    height: "20px",
  },
});

const Links = styled(Ul, {
  display: "flex",
  flexDirection: "row",
  justifyContent: "end",
  gap: "$1",
});

export const Header = () => (
  <StyledHeader>
    <StyledNav aria-label="Main navigation">
      <Headline>emuze</Headline>
      <Links>
        <li>
          <StyledLink to="/" draggable={false} title="Library">
            <IoLibrarySharp />
          </StyledLink>
        </li>
        <li>
          <StyledLink to="/settings" draggable={false} title="Settings">
            <IoMdSettings />
          </StyledLink>
        </li>
      </Links>
    </StyledNav>
  </StyledHeader>
);
