import { styled } from "~/stitches";
import { Ul } from "~/components/Ul";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";

const SidebarWrapper = styled("aside", {
  background:
    "linear-gradient(45deg, $backgroundColor, $sidebarBackgroundColor)",
  padding: "$2",
  display: "flex",
  flexFlow: "column",
  overflow: "auto",
  resize: "horizontal",
  width: "250px",
});

const StyledUl = styled(Ul, {
  display: "flex",
  flexDirection: "column",
  gap: "$1",
});

interface Props {
  header?: React.ReactNode;
  headline: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Sidebar = ({ header, headline, children, actions }: Props) => (
  <SidebarWrapper>
    {header}
    <ListActionBarLayout headline={headline}>
      <ListActionBarLayout.ListActionBarContainer
        list={
          <nav>
            <StyledUl>{children}</StyledUl>
          </nav>
        }
        actions={actions}
      />
    </ListActionBarLayout>
  </SidebarWrapper>
);
