import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout";
import { IconChildrenWrapper } from "../components/IconChildrenWrapper";
import { SettingsIcon } from "../components/SettingsIcon";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { Typography } from "../components/Typography";
import { version } from "../../package.json";
import { styled } from "../../styled-system/jsx";
import { Logo } from "../components/Logo";
import { Link } from "../components/Link";
import {
  useInputBack,
  useInputConfirmation,
} from "../hooks/useDirectionalInput";
import type { ElementRef } from "react";
import { useCallback } from "react";
import { useFocus } from "../hooks/useFocus";
import type { FocusElement } from "../types/focusElement";
import type { Result } from "../hooks/useGamepadsOnGrid";
import { useGamepadsOnGrid } from "../hooks/useGamepadsOnGrid";
import type { IconType } from "react-icons";

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return (
    <>
      <h2>Error!</h2>
      <p>{error.message}</p>
    </>
  );
};

export const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "start",
    flexWrap: "wrap",
    gap: "1",
  },
});

export const List = styled("div", {
  base: {
    width: "50%",
    minWidth: "fit-content",
    display: "flex",
    flexDirection: "column",
    gap: "2",
  },
});

export const Properties = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    rowGap: "0.2rem",
    columnGap: "1rem",
  },
});

interface Link {
  to: string;
  href: string;
  icon: IconType;
}

const linkConfig: Link[] = [
  { href: "https://github.com/bmsuseluda/emuze", to: "GitHub", icon: FaGithub },
  {
    href: "https://github.com/bmsuseluda/emuze/releases",
    to: "Changelog",
    icon: CgNotes,
  },
  { href: "https://discord.gg/tCzK7kc6Y4", to: "Discord", icon: FaDiscord },
];

export const Links = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "1",
  },
});

const focus: FocusElement = "settingsMain";

export default function About() {
  const { isInFocus, switchFocusBack } = useFocus<FocusElement>(focus);

  const selectEntry = useCallback((entry: ElementRef<"a">) => {
    entry.focus();
  }, []);

  const goBack = useCallback(
    (resetSelected: () => void) => {
      resetSelected();
      switchFocusBack();
    },
    [switchFocusBack],
  );

  const onLeftOverTheEdge = useCallback(
    ({ resetSelected }: Result<ElementRef<"a">>) => {
      goBack(resetSelected);
    },
    [goBack],
  );

  const { entryListRef, entriesRefCallback, selectedEntry, resetSelected } =
    useGamepadsOnGrid({
      onSelectEntry: selectEntry,
      isInFocus,
      onLeftOverTheEdge,
    });

  const onConfirmation = useCallback(() => {
    if (isInFocus) {
      selectedEntry.current?.click();
    }
  }, [isInFocus, selectedEntry]);

  const onBack = useCallback(() => {
    if (isInFocus) {
      goBack(resetSelected);
    }
  }, [isInFocus, resetSelected, goBack]);

  useInputConfirmation(onConfirmation);
  useInputBack(onBack);

  return (
    <>
      <ListActionBarLayout
        headline={
          <IconChildrenWrapper>
            <SettingsIcon id="about" />
            <Typography ellipsis>About</Typography>
          </IconChildrenWrapper>
        }
      >
        <ListActionBarLayout.ListActionBarContainer
          list={
            <Wrapper>
              <List>
                <Properties>
                  <p>Version:</p>
                  <p>{version}</p>

                  <p>Copyright: </p>
                  <p>2022 - {new Date().getFullYear()}</p>

                  <p>Author:</p>
                  <p>bmsuseluda</p>

                  <p>Licence:</p>
                  <p>GPL-3.0</p>
                </Properties>
                <Links ref={entryListRef}>
                  {linkConfig.map(({ href, to, icon }, index) => (
                    <li key={to}>
                      <Link
                        href={href}
                        icon={icon}
                        ref={entriesRefCallback(index)}
                      >
                        {to}
                      </Link>
                    </li>
                  ))}
                </Links>
              </List>
              <Logo />
            </Wrapper>
          }
        />
      </ListActionBarLayout>
    </>
  );
}
