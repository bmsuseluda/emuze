import { Ul } from "~/components/Ul";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import type { ReactNode } from "react";
import { styled } from "../../../../../../styled-system/jsx";
import { Separator } from "~/components/Separator";

const SidebarWrapper = styled("aside", {
  base: {
    bgGradient: "default",
    paddingTop: "1",
    paddingRight: "0.5rem",
    paddingBottom: "1",
    paddingLeft: "1",
    display: "flex",
    flexFlow: "column",
    overflowX: "hidden",
    overflowY: "auto",
    width: "15rem",
    transition: "width 0.5s ease-in-out",
    gap: "1.5rem",
  },

  variants: {
    collapse: {
      true: {
        width: "4rem",
        paddingLeft: "0.5rem",
      },
    },
  },
});

const StyledUl = styled(Ul, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "1",
    overflowX: "hidden",
  },

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
    {header}
    {header && <Separator />}
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
