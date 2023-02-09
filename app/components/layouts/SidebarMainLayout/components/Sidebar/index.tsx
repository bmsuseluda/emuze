import { styled } from "~/stitches";
import { Ul } from "~/components/Ul";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { Separator } from "~/components/Separator";
import { useFullscreen } from "~/hooks/useFullscreen";

const SidebarWrapper = styled("aside", {
  background: "$gradiants$default",
  padding: "$2 0.5em $1 $1",
  display: "flex",
  flexFlow: "column",
  overflow: "auto",
  width: "15em",
  gap: "1.5em",

  variants: {
    isFullscreen: {
      true: {
        paddingTop: "$1",
      },
    },
  },
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

export const Sidebar = ({ header, headline, children, actions }: Props) => {
  const isFullscreen = useFullscreen();
  return (
    <SidebarWrapper isFullscreen={isFullscreen}>
      {header}
      <Separator />
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
};
