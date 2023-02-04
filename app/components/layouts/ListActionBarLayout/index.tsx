import { styled } from "~/stitches";
import { Headline } from "~/components/Headline";
import { useEffect, useRef } from "react";
import { useLocation } from "@remix-run/react";

interface Props {
  headline: React.ReactNode;
  children: React.ReactNode;
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
  },
});

const ActionBar = styled("div", {
  flex: 1,
  display: "flex",
  gap: "$1",
  alignItems: "center",
});

interface ContainerProps {
  list: React.ReactNode;
  scrollToTopOnLocationChange?: boolean;
  actions: React.ReactNode;
  scrollSmooth?: boolean;
}

const ListActionBarContainer = ({
  list: listEntries,
  scrollToTopOnLocationChange = false,
  actions,
  scrollSmooth,
}: ContainerProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    // TODO: Check whats wrong here
    console.log("location", location.pathname, scrollToTopOnLocationChange);
    if (scrollToTopOnLocationChange && listRef.current?.scrollTo) {
      // @ts-ignore There is no other way to deactivate smooth scrolling here
      listRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, scrollToTopOnLocationChange]);

  return (
    <Absolute>
      <List ref={listRef} scrollSmooth={scrollSmooth}>
        {listEntries}
      </List>
      <ActionBar>{actions}</ActionBar>
    </Absolute>
  );
};

export const ListActionBarLayout = ({ headline, children }: Props) => (
  <Layout>
    <Headline>{headline}</Headline>
    <Wrapper>{children}</Wrapper>
  </Layout>
);

ListActionBarLayout.ListActionBarContainer = ListActionBarContainer;
