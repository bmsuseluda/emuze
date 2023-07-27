import { Headline } from "~/components/Headline";
import type { ReactNode } from "react";
import { forwardRef } from "react";
import { styled } from "../../../../styled-system/jsx";

interface Props {
  headline?: ReactNode;
  children: ReactNode;
}

const Layout = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "1.5em",
  },
});

const Wrapper = styled("div", { base: { position: "relative", flex: 6 } });
const Absolute = styled("div", {
  base: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    gap: "1",
  },
});

const List = styled("div", {
  base: {
    flex: 15,
    overflowY: "auto",
    paddingRight: "0.5em",

    scrollbarColor: "sidebarBackgroundColor transparent",

    "&::-webkit-scrollbar": {
      width: "0.5em",
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
      borderRadius: "1",
    },
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

        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
      false: {
        "&:hover": {
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "sidebarBackgroundColor",
          },
        },
      },
    },
  },
});

const ActionBar = styled("div", {
  base: {
    flex: 1,
    display: "flex",
    gap: "1",
    alignItems: "center",
  },

  variants: {
    collapse: {
      true: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
});

interface ContainerProps {
  list: ReactNode;
  actions: ReactNode;
  scrollSmooth?: boolean;
  collapse?: boolean;
}

const ListActionBarContainer = forwardRef<HTMLDivElement, ContainerProps>(
  ({ list: listEntries, actions, scrollSmooth, collapse = false }, ref) => {
    return (
      <Absolute>
        <List ref={ref} scrollSmooth={scrollSmooth} collapse={collapse}>
          {listEntries}
        </List>
        <ActionBar collapse={collapse}>{actions}</ActionBar>
      </Absolute>
    );
  }
);
ListActionBarContainer.displayName = "ListActionBarContainer";

export const ListActionBarLayout = ({ headline, children }: Props) => (
  <Layout>
    {headline && <Headline>{headline}</Headline>}
    <Wrapper>{children}</Wrapper>
  </Layout>
);

ListActionBarLayout.ListActionBarContainer = ListActionBarContainer;
