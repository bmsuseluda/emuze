import type { ReactNode } from "react";
import { styled } from "../../../styled-system/jsx";

const Wrapper = styled("span", {
  base: {
    display: "flex",
    flexDirection: "row",
    gap: "0.5em",
    alignItems: "center",
    whiteSpace: "nowrap",
    color: "color",

    "& > svg": {
      minHeight: "1.2em",
      minWidth: "1.2em",
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
