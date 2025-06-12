import { styled } from "../../../styled-system/jsx/index.js";
import type { IconType } from "react-icons";
import { IconChildrenWrapper } from "../IconChildrenWrapper/index.js";
import type { ComponentProps } from "react";

interface Props extends ComponentProps<typeof StyledLink> {
  icon: IconType;
}

const StyledLink = styled("a", {
  base: {
    all: "unset",
    display: "inline-block",
    boxSizing: "border-box",
    outlineRounded: true,
    outlineWidth: "2px",
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: "0.5rem",
    color: "color",
    width: "fit-content",

    "&:hover": {
      cursor: "pointer",
    },

    "&:focus-visible": {
      outlineColor: "accent",
    },
  },
});

export const Link = ({ href, children, icon: Icon, ...rest }: Props) => {
  return (
    <StyledLink href={href} target="_blank" {...rest}>
      <IconChildrenWrapper>
        <Icon />
        {children}
      </IconChildrenWrapper>
    </StyledLink>
  );
};
