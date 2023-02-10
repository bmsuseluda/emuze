import { styled } from "~/stitches";
import { Headline } from "~/components/Headline";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface Props {
  headline?: ReactNode;
  children: ReactNode;
}

const Layout = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: "1.5em",
});

const Wrapper = styled("div", { position: "relative", flex: 6 });
const Absolute = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  gap: "$1",
});

const List = styled("div", {
  flex: 15,
  overflowY: "auto",
  paddingRight: "1.5em",

  scrollbarColor: "$colors$sidebarBackgroundColor transparent",

  "&::-webkit-scrollbar": {
    width: "0.7em",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "$sidebarBackgroundColor",
    borderRadius: "$1",
  },
  variants: {
    scrollSmooth: {
      true: {
        scrollBehavior: "smooth",
      },
    },
    collapse: {
      true: {
        paddingRight: 0,
      },
    },
  },
});

const ActionBar = styled("div", {
  flex: 1,
  display: "flex",
  gap: "$1",
  alignItems: "center",
});

interface ContainerProps {
  list: ReactNode;
  scrollToTopOnLocationChange?: boolean;
  locationPathname?: string;
  actions: ReactNode;
  scrollSmooth?: boolean;
  collapse?: boolean;
}

const ListActionBarContainer = ({
  list: listEntries,
  scrollToTopOnLocationChange = false,
  locationPathname,
  actions,
  scrollSmooth,
  collapse = false,
}: ContainerProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToTopOnLocationChange && listRef.current?.scrollTo) {
      // @ts-ignore There is no other way to deactivate smooth scrolling here
      listRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [locationPathname, scrollToTopOnLocationChange]);

  return (
    <Absolute>
      <List ref={listRef} scrollSmooth={scrollSmooth} collapse={collapse}>
        {listEntries}
      </List>
      <ActionBar>{actions}</ActionBar>
    </Absolute>
  );
};

export const ListActionBarLayout = ({ headline, children }: Props) => (
  <Layout>
    {headline && <Headline>{headline}</Headline>}
    <Wrapper>{children}</Wrapper>
  </Layout>
);

ListActionBarLayout.ListActionBarContainer = ListActionBarContainer;
