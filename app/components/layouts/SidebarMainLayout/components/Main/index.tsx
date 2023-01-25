import { styled } from "~/stitches";
import type { ReactNode } from "react";
import { useFullscreen } from "~/hooks/useFullscreen";

const StyledMain = styled("main", {
  flex: 6,
  padding: "$2 0.5em $1 $2",
  display: "flex",

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
};

export const Main = ({ children }: Props) => {
  const isFullscreen = useFullscreen();
  return <StyledMain isFullscreen={isFullscreen}>{children}</StyledMain>;
};
