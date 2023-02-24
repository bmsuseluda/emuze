import { styled } from "~/stitches";
import type { ReactNode } from "react";

const StyledMain = styled("main", {
  flex: 6,
  padding: "$2 0.5em $1 $2",
  display: "flex",
  backgroundColor: "$backgroundColor",

  variants: {
    isFullscreen: {
      true: {
        paddingTop: "$1",
      },
    },
  },
});

type Props = {
  children: ReactNode;
  isFullscreen?: boolean;
};

export const Main = ({ children, isFullscreen = false }: Props) => (
  <StyledMain isFullscreen={isFullscreen}>{children}</StyledMain>
);
