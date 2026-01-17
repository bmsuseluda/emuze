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
      minWidth: "iconSmall",
      height: "auto",
      aspectRatio: "1",
      verticalAlign: "middle",
    },
  },
  variants: {
    iconSize: {
      small: {
        "& > svg": {
          width: "iconSmall",
          minWidth: "iconSmall",
        },
      },
      medium: {
        "& > svg": {
          width: "iconMedium",
          minWidth: "iconMedium",
        },
      },
      large: {
        "& > svg": {
          width: "iconLarge",
          minWidth: "iconLarge",
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
