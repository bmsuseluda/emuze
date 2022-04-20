import type { ButtonHTMLAttributes } from "react";
import {
  VscChromeClose,
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
} from "react-icons/vsc";
import { styled } from "~/stitches";

const iconVariant = {
  close: VscChromeClose,
  minimize: VscChromeMinimize,
  maximize: VscChromeMaximize,
  restore: VscChromeRestore,
};

interface Props {
  variant: keyof typeof iconVariant;
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
    window.postMessage({ type: "window", name: variant });
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
