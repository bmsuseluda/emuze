import { styled } from "~/stitches";
import { Ul } from "~/components/Ul";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";

const SidebarWrapper = styled("aside", {
  background: "$gradiants$default",
  padding: "25px 0.5em $2 $2",
  display: "flex",
  flexFlow: "column",
  overflow: "auto",
  resize: "horizontal",
  width: "15em",
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
