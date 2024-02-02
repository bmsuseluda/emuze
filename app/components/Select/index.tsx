import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { TiArrowSortedDown } from "react-icons/ti";
import { GiCheckMark } from "react-icons/gi";
import { styled } from "../../../styled-system/jsx";

const SelectTrigger = styled(RadixSelect.SelectTrigger, {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: "sidebarBackgroundColor",
    backgroundColor: "backgroundColor",
    color: "color",
    padding: "1",
    borderRadius: "1",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",

    "&:focus": {
      borderColor: "accent",
    },
  },
});

const SelectIcon = styled(RadixSelect.SelectIcon, {
  base: {
    "& svg": {
      width: "30px",
      height: "30px",
      verticalAlign: "middle",
    },
  },
});

const StyledContent = styled(RadixSelect.Content, {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: "sidebarBackgroundColor",
    backgroundColor: "backgroundColor",
    color: "color",
    padding: "1",
    borderRadius: "1",
    outline: "none",
    width: "var(--radix-popper-anchor-width)",
    boxSizing: "border-box",
  },
});

const StyledItem = styled(RadixSelect.Item, {
  base: {
    fontSize: 13,
    lineHeight: 1,
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    height: 25,
    padding: "0 35px 0 25px",
    position: "relative",
    userSelect: "none",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "transparent",

    "&[data-highlighted]": {
      outline: "none",
      borderColor: "accent",
    },
  },
});

const StyledItemIndicator = styled(RadixSelect.ItemIndicator, {
  base: {
    position: "absolute",
    left: 0,
    width: 25,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Trigger = forwardRef<
  ElementRef<typeof SelectTrigger>,
  ComponentPropsWithoutRef<typeof SelectTrigger> & { placeholder?: string }
>(({ placeholder, ...rest }, ref) => (
  <SelectTrigger ref={ref} {...rest}>
    <RadixSelect.Value placeholder={placeholder} />
    <SelectIcon>
      <TiArrowSortedDown />
    </SelectIcon>
  </SelectTrigger>
));
Trigger.displayName = "Trigger";

const Content = forwardRef<
  ElementRef<typeof StyledContent>,
  ComponentPropsWithoutRef<typeof StyledContent>
>(({ children, ...rest }, ref) => (
  <StyledContent position="popper" sideOffset={5} {...rest} ref={ref}>
    <RadixSelect.Viewport>
      <RadixSelect.Group>{children}</RadixSelect.Group>
    </RadixSelect.Viewport>
  </StyledContent>
));
Content.displayName = "Content";

const Item = forwardRef<
  ElementRef<typeof StyledItem>,
  ComponentPropsWithoutRef<typeof StyledItem>
>(({ children, ...props }, ref) => (
  <StyledItem {...props} ref={ref}>
    <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    <StyledItemIndicator>
      <GiCheckMark />
    </StyledItemIndicator>
  </StyledItem>
));
Item.displayName = "Item";

export const Select = {
  Root: RadixSelect.Root,
  Trigger,
  Content,
  Item,
};
