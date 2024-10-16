import type { ReactNode } from "react";
import { styled } from "../../../../../../styled-system/jsx";

const StyledMain = styled("main", {
  base: {
    flex: 6,
    paddingTop: "1",
    paddingBottom: "1",
    paddingLeft: "outlinePadding",
    paddingRight: "outlinePadding",
    display: "flex",
    backgroundColor: "backgroundColor",
    minWidth: "25rem",
  },
});

interface Props {
  children: ReactNode;
}

export const Main = ({ children }: Props) => (
  <StyledMain>{children}</StyledMain>
);
