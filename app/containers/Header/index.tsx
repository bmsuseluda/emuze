import { IoMdSettings } from "react-icons/io";
import { IoLibrarySharp } from "react-icons/io5";
import { styled } from "~/stitches";

import { Ul } from "~/components/Ul";
import { Link } from "../Link";
import { layout } from "~/hooks/useGamepads/layouts";
import { useCallback, useRef } from "react";
import type { IconType } from "react-icons";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElements } from "~/types/focusElements";

const Headline = styled("h1", {
  margin: 0,
  padding: 0,
});

const StyledNav = styled("nav", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  variants: {
    collapse: {
      true: {
        display: "block",
      },
    },
  },
});

const StyledHeader = styled("header", {
  marginBottom: "-0.8em",
});

const Links = styled(Ul, {
  display: "flex",
  flexDirection: "row",
  justifyContent: "end",
  gap: "$1",

  variants: {
    collapse: {
      true: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
  },
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

type Props = {
  collapse?: boolean;
};

export const Header = ({ collapse = false }: Props) => {
  const linksRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const { switchFocus } = useFocus<FocusElements>("sidebar");

  // TODO: move header to root layout
  const selectLink = (index: number) => {
    linksRefs.current[index]?.focus();
    linksRefs.current[index]?.click();
  };

  const onSettings = useCallback(() => {
    switchFocus("sidebar");
    if (window.location.pathname.startsWith("/categories")) {
      selectLink(links.findIndex(({ to }) => to === "/settings"));
    } else {
      selectLink(links.findIndex(({ to }) => to === "/categories"));
    }
  }, []);

  useGamepadButtonPressEvent(layout.buttons.Start, onSettings);
  useKeyboardEvent("Escape", onSettings);

  return (
    <StyledHeader>
      <StyledNav aria-label="Main navigation" collapse={collapse}>
        {!collapse && <Headline>emuze</Headline>}
        <Links collapse={collapse}>
          {links.map(({ to, icon: Icon, title }) => (
            <Link
              to={to}
              icon={<Icon />}
              aria-label={title}
              title={collapse ? undefined : title}
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
