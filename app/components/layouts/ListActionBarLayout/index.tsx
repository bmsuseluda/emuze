import { styled } from "~/stitches";
import { Headline } from "~/components/Headline";

interface Props {
  headline: React.ReactNode;
  children: React.ReactNode;
}

const Layout = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: 1,
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
  gap: "$2",
});

const List = styled("div", {
  flex: 15,
  overflowY: "auto",
  paddingRight: "$1",

  scrollbarColor: "$colors$sidebarBackgroundColor transparent",

  "&::-webkit-scrollbar": {
    width: "12px",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "$sidebarBackgroundColor",
    borderRadius: "$1",
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
  actions: React.ReactNode;
}

const ListActionBarContainer = ({
  list: listEntries,
  actions,
}: ContainerProps) => (
  <Absolute>
    <List>{listEntries}</List>
    <ActionBar>{actions}</ActionBar>
  </Absolute>
);

export const ListActionBarLayout = ({ headline, children }: Props) => (
  <Layout>
    <Headline>{headline}</Headline>
    <Wrapper>{children}</Wrapper>
  </Layout>
);

ListActionBarLayout.ListActionBarContainer = ListActionBarContainer;
