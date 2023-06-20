import { styled } from "~/stitches";
import { keyframes } from "@stitches/react";
import type { ReactNode } from "react";

const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const Wrapper = styled("span", {
  display: "flex",
  flexDirection: "row",
  gap: "0.5em",
  alignItems: "center",
  whiteSpace: "nowrap",

  "> svg": {
    minHeight: "1.2em",
    minWidth: "1.2em",
    verticalAlign: "middle",
  },

  variants: {
    rotate: {
      true: {
        "> svg": {
          animation: `${rotate} 2s linear infinite`,
        },
      },
    },
  },
});

type Props = {
  children: ReactNode;
  rotate?: boolean;
};

// TODO: add story
export const IconChildrenWrapper = ({
  children,
  rotate = false,
  ...rest
}: Props) => (
  <Wrapper rotate={rotate} {...rest}>
    {children}
  </Wrapper>
);
