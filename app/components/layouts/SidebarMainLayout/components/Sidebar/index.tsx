import { styled } from "~/stitches";
import { Ul } from "~/components/Ul";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { Separator } from "~/components/Separator";
import { useFullscreen } from "~/hooks/useFullscreen";
import type { ReactNode } from "react";

const SidebarWrapper = styled("aside", {
  background: "$gradiants$default",
  padding: "$2 0.5em $1 $1",
  display: "flex",
  flexFlow: "column",
  overflow: "auto",
  width: "15em",
  transition: "width 0.5s ease-in-out",
  gap: "1.5em",

  variants: {
    isFullscreen: {
      true: {
        paddingTop: "$1",
      },
    },
    collapse: {
      true: {
        width: "2.5em",
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
  header?: ReactNode;
  headline: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  collapse?: boolean;
}

export const Sidebar = ({
  header,
  headline,
  children,
  actions,
  collapse = false,
}: Props) => {
  const isFullscreen = useFullscreen();
  return (
    <SidebarWrapper isFullscreen={isFullscreen} collapse={collapse}>
      {header}
      <Separator />
      <ListActionBarLayout headline={collapse ? undefined : headline}>
        <ListActionBarLayout.ListActionBarContainer
          list={
            <nav>
              <StyledUl>{children}</StyledUl>
            </nav>
          }
          actions={actions}
          collapse={collapse}
        />
      </ListActionBarLayout>
    </SidebarWrapper>
  );
};
