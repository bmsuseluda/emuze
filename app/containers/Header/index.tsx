import { IoMdSettings } from "react-icons/io";
import { IoLibrarySharp } from "react-icons/io5";
import { styled } from "~/stitches";

import { Ul } from "~/components/Ul";
import { Link } from "../Link";
import layout from "~/hooks/useGamepads/layouts/xbox";
import { useRef } from "react";
import type { IconType } from "react-icons";
import { useGamepadEvent } from "~/hooks/useGamepadEvent";

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

type LinkData = {
  to: string;
  icon: IconType;
  title: string;
};

const links: LinkData[] = [
  { to: "/categories", icon: IoLibrarySharp, title: "Library" },
  { to: "/settings", icon: IoMdSettings, title: "Settings" },
];

export const Header = () => {
  const linksRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // TODO: move header to root layout
  const selectLink = (index: number) => {
    linksRefs.current[index]?.focus();
    linksRefs.current[index]?.click();
  };

  useGamepadEvent(layout.buttons.Start, () => {
    if (window.location.pathname.startsWith("/categories")) {
      selectLink(links.findIndex(({ to }) => to === "/settings"));
    } else {
      selectLink(links.findIndex(({ to }) => to === "/categories"));
    }
  });

  return (
    <StyledHeader>
      <StyledNav aria-label="Main navigation">
        <Headline>emuze</Headline>
        <Links>
          {links.map(({ to, icon: Icon, title }) => (
            <Link
              to={to}
              icon={<Icon />}
              aria-label={title}
              title={title}
              key={title}
              ref={(ref: HTMLAnchorElement) => {
                linksRefs.current.push(ref);
              }}
            />
          ))}
        </Links>
      </StyledNav>
    </StyledHeader>
  );
};
