import { Ul } from "../../../../Ul";
import { ListActionBarLayout } from "../../../ListActionBarLayout";
import type { ReactNode } from "react";
import { styled } from "../../../../../../styled-system/jsx";
import { Separator } from "../../../../Separator";

const SidebarWrapper = styled("aside", {
  base: {
    bgGradient: "default",
    paddingTop: "1",
    paddingRight: "0.5rem",
    paddingBottom: "1",
    paddingLeft: "1",
    display: "flex",
    flexFlow: "column",
    overflowX: "clip",
    overflowY: "auto",
    width: "15rem",
    minWidth: "15rem",
    transition: "width 0.5s ease-in-out, min-width 0.5s ease-in-out",
  },

  variants: {
    collapse: {
      true: {
        width: "4rem",
        minWidth: "4rem",
        paddingLeft: "0.5rem",
      },
    },
  },
});

const HeaderWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "{sizes.scrollMask}",
  },
});

const StyledUl = styled(Ul, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "1",
    overflowX: "clip",
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
    {header && (
      <HeaderWrapper>
        {header}
        <Separator />
      </HeaderWrapper>
    )}
    <ListActionBarLayout headline={collapse ? undefined : headline}>
      <ListActionBarLayout.ListActionBarContainer
        list={
          <nav>
            <StyledUl collapse={collapse}>{children}</StyledUl>
          </nav>
        }
        actions={actions}
        collapse={collapse}
        scrollSmooth
      />
    </ListActionBarLayout>
  </SidebarWrapper>
);
