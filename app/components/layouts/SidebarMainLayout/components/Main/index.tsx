import { styled } from "~/stitches";
import type { ReactNode } from "react";

const StyledMain = styled("main", {
  flex: 6,
  padding: "$1 0.5em $1 $2",
  display: "flex",
  backgroundColor: "$backgroundColor",
});

type Props = {
  children: ReactNode;
};

export const Main = ({ children }: Props) => (
  <StyledMain>{children}</StyledMain>
);
