import { styled } from "~/stitches";
import { keyframes } from "@stitches/react";

const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const Wrapper = styled("span", {
  variants: {
    icon: {
      true: {
        display: "flex",
        flexDirection: "row",
        gap: "$1",
        alignItems: "center",
        "> svg": {
          minWidth: "1.3rem",
          minHeight: "1.3rem",
          maxWidth: "1.3rem",
          maxHeight: "1.3rem",
          verticalAlign: "middle",
        },
      },
    },
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
  icon?: React.ReactNode;
  children: React.ReactNode;
  rotate?: boolean;
};

// TODO: add story
export const IconChildrenWrapper = ({
  icon,
  children,
  rotate = false,
  ...rest
}: Props) => (
  <Wrapper icon={!!icon} rotate={rotate} {...rest}>
    {icon && icon}
    {children}
  </Wrapper>
);
