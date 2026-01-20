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
      width: "iconSmall",
      height: "auto",
      aspectRatio: "1",
      verticalAlign: "middle",
      flexShrink: 0,
    },
  },
  variants: {
    iconSize: {
      small: {
        "& > svg": {
          width: "iconSmall",
        },
      },
      medium: {
        "& > svg": {
          width: "iconMedium",
        },
      },
      large: {
        "& > svg": {
          width: "iconLarge",
        },
      },
    },
  },
});

interface Props {
  children: ReactNode;
  iconSize: "small" | "medium" | "large";
}

export const IconChildrenWrapper = ({ children, ...rest }: Props) => (
  <Wrapper {...rest}>{children}</Wrapper>
);
