import { Ul } from "../../../../Ul/index.js";
import { ListActionBarLayout } from "../../../ListActionBarLayout/index.js";
import type { ReactNode } from "react";
import { styled } from "../../../../../../styled-system/jsx/index.js";
import { Separator } from "../../../../Separator/index.js";

const SidebarWrapper = styled("aside", {
  base: {
    bgGradient: "default",
    paddingTop: "1",
    paddingRight: "0",
    paddingBottom: "1",
    paddingLeft: "0",
    display: "flex",
    flexFlow: "column",
    overflowX: "clip",
    overflowY: "visible",
    width: "15rem",
    minWidth: "15rem",
    transition: "width 0.5s ease-in-out, min-width 0.5s ease-in-out",
  },

  variants: {
    collapse: {
      true: {
        width: "5rem",
        minWidth: "5rem",
      },
    },
  },
});

const HeaderWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "{sizes.scrollMask}",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
  },
});

const StyledUl = styled(Ul, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
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
  headline?: string;
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
    <ListActionBarLayout
      headline={headline && !collapse ? { title: headline } : undefined}
      paddingLeft="small"
    >
      <ListActionBarLayout.ListActionBarContainer
        list={
          <nav>
            <StyledUl collapse={collapse}>{children}</StyledUl>
          </nav>
        }
        actions={actions}
        collapse={collapse}
        scrollSmooth
        paddingSide={false}
      />
    </ListActionBarLayout>
  </SidebarWrapper>
);
