import type { ReactNode } from "react";
import { styled } from "../../../../../../styled-system/jsx/index.js";

const StyledMain = styled("main", {
  base: {
    flex: 6,
    paddingTop: "1",
    paddingBottom: "1",
    paddingLeft: "outlinePadding",
    paddingRight: "2",
    display: "flex",
    backgroundColor: "backgroundColor",
    minWidth: "25rem",
  },

  variants: {
    dynamicWidth: {
      true: {
        minWidth: "unset",
        paddingLeft: "1",
        paddingRight: "1",
      },
    },
  },
});

interface Props {
  children: ReactNode;
  dynamicWidth?: boolean;
}

export const Main = ({ children, dynamicWidth }: Props) => (
  <StyledMain dynamicWidth={dynamicWidth}>{children}</StyledMain>
);
