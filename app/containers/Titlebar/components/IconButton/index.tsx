import type { ButtonHTMLAttributes } from "react";
import type { IconType } from "react-icons";
import {
  VscChromeClose,
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
} from "react-icons/vsc";
import { styled } from "~/stitches";

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
  margin: 0,
  padding: "$1 15px",
  lineHeight: "16px",
  blockSize: "16px",
  backgroundColor: "transparent",
  border: "none",
  color: "white",
  boxSizing: "content-box",

  "& svg": {
    width: "16px",
    height: "16px",
  },

  "&:hover": {
    backgroundColor: "#3d3c40b3",
  },

  "&:focus": {
    outline: "none",
  },
});

const CloseButton = styled(Button, {
  "&:hover": {
    backgroundColor: "#E81123",
  },
});

export const IconButton = ({
  variant,
  ...rest
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const Icon = iconVariant[variant];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
