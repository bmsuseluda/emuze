import type { ReactNode } from "react";
import { styled } from "../../../styled-system/jsx/index.js";

const Wrapper = styled("span", {
  base: {
    display: "flex",
    flexDirection: "row",
    gap: "0.5em",
    alignItems: "center",
    whiteSpace: "nowrap",
    color: "color",

    "& > svg": {
      minHeight: "max(20px, 1.2em)",
      minWidth: "max(20px, 1.2em)",
      verticalAlign: "middle",
    },
  },

  variants: {
    rotate: {
      true: {
        "& > svg": {
          animation: "spin 2s linear infinite",
        },
      },
    },
  },
});

interface Props {
  children: ReactNode;
  rotate?: boolean;
}

export const IconChildrenWrapper = ({
  children,
  rotate = false,
  ...rest
}: Props) => (
  <Wrapper rotate={rotate} {...rest}>
    {children}
  </Wrapper>
);
