import { IoMdSettings } from "react-icons/io";
import { IoLibrarySharp } from "react-icons/io5";
import { styled } from "~/stitches";

import { Ul } from "~/components/Ul";
import { Link } from "../Link";

const Headline = styled("h1", {
  margin: 0,
  padding: 0,
});

const StyledNav = styled("nav", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const StyledHeader = styled("header", {
  borderBottom: "1px solid $color",
  padding: "$1 $1 $1 0",
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
        <Link
          to="/categories"
          icon={<IoLibrarySharp />}
          aria-label="Library"
          title="Library"
        />
        <Link
          to="/settings"
          icon={<IoMdSettings />}
          aria-label="Settings"
          title="Settings"
        />
      </Links>
    </StyledNav>
  </StyledHeader>
);
