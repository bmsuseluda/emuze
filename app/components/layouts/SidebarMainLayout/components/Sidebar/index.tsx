import { styled } from "~/stitches";
import { Ul } from "~/components/Ul";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { Separator } from "~/components/Separator";
import type { ReactNode } from "react";

const SidebarWrapper = styled("aside", {
  background: "$gradients$default",
  padding: "$1 0.5rem $1 $1",
  display: "flex",
  flexFlow: "column",
  overflowX: "hidden",
  overflowY: "auto",
  width: "15rem",
  transition: "width 0.5s ease-in-out",
  gap: "1.5rem",

  variants: {
    collapse: {
      true: {
        width: "3.5rem",
        paddingLeft: "0.5rem",
      },
    },
  },
});

const StyledUl = styled(Ul, {
  display: "flex",
  flexDirection: "column",
  gap: "$1",
  overflowX: "hidden",

  variants: {
    collapse: {
      true: {
        alignItems: "center",
      },
    },
  },
});

interface Props {
  header?: ReactNode;
  headline?: ReactNode;
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
}: Props) => (
  <SidebarWrapper collapse={collapse}>
    {!collapse && header}
    {!collapse && header && <Separator />}
    <ListActionBarLayout headline={collapse ? undefined : headline}>
      <ListActionBarLayout.ListActionBarContainer
        list={
          <nav>
            <StyledUl collapse={collapse}>{children}</StyledUl>
          </nav>
        }
        actions={actions}
        collapse={collapse}
      />
    </ListActionBarLayout>
  </SidebarWrapper>
);
