import { styled } from "../../../styled-system/jsx";
import type { IconType } from "react-icons";
import { IconChildrenWrapper } from "../IconChildrenWrapper";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

interface Props extends ComponentPropsWithoutRef<typeof StyledLink> {
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

export const Link = forwardRef<ElementRef<typeof StyledLink>, Props>(
  ({ href, children, icon: Icon, ...rest }, ref) => {
    return (
      <StyledLink href={href} target="_blank" {...rest} ref={ref}>
        <IconChildrenWrapper>
          <Icon />
          {children}
        </IconChildrenWrapper>
      </StyledLink>
    );
  },
);
Link.displayName = "Link";
