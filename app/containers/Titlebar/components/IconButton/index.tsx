import type { ButtonHTMLAttributes } from "react";
import type { IconType } from "react-icons";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore,
} from "react-icons/vsc";
import { styled } from "../../../../../styled-system/jsx";

const iconVariant: Record<WindowChangeEvents, IconType> = {
  close: VscChromeClose,
  minimize: VscChromeMinimize,
  maximize: VscChromeMaximize,
  restore: VscChromeRestore,
  fullscreen: VscChromeMaximize,
};

interface Props {
  variant: WindowChangeEvents;
}

const Button = styled("button", {
  base: {
    margin: 0,
    paddingTop: "1",
    paddingRight: "15px",
    paddingBottom: "1",
    paddingLeft: "15px",
    lineHeight: "16px",
    blockSize: "16px",
    backgroundColor: "transparent",
    border: "none",
    color: "color",
    boxSizing: "content-box",

    "& svg": {
      width: "16px",
      height: "16px",
      verticalAlign: "middle",
    },

    "&:hover": {
      backgroundColor: "#3d3c40b3",
    },

    "&:focus": {
      outline: "none",
    },
  },
});

const CloseButton = styled(Button, {
  base: {
    "&:hover": {
      backgroundColor: "#E81123",
    },
  },
});

export const IconButton = ({
  variant,
  ...rest
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const Icon = iconVariant[variant];

  const handleClick = () => {
    electronAPI.changeWindow(variant);
  };

  if (variant === "close") {
    return (
      <CloseButton aria-label={variant} onClick={handleClick} {...rest}>
        <Icon />
      </CloseButton>
    );
  }

  return (
    <Button aria-label={variant} onClick={handleClick} {...rest}>
      <Icon />
    </Button>
  );
};
