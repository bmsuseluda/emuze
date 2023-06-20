import { styled } from "~/stitches";
import type { ReactNode } from "react";

const Input = styled("input", {
  borderStyle: "solid",
  borderWidth: "$2",
  borderColor: "$sidebarBackgroundColor",
  backgroundColor: "$backgroundColor",
  color: "$color",
  padding: "$1",
  borderRadius: "$1",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "inherit",
  fontSize: "80%",
  fontWeight: 300,

  "&:focus": {
    borderColor: "$accent",
  },

  "&:invalid": {
    borderColor: "$error",
    borderStyle: "dashed",
  },

  variants: {
    iconButton: {
      true: {
        paddingRight: "$3",
      },
    },
  },
});

const IconButton = styled("button", {
  all: "unset",
  position: "absolute",
  right: "1rem",
  top: "50%",
  transform: "translate(0, -50%)",
  marginTop: "auto",
  marginBottom: "auto",
  cursor: "pointer",
  color: "$color",

  "> svg": {
    minWidth: "1.3rem",
    minHeight: "1.3rem",
    maxWidth: "1.3rem",
    maxHeight: "1.3rem",
    verticalAlign: "middle",
  },
});

const Wrapper = styled("div", {
  position: "relative",

  "&:focus-within": {
    Input: {
      borderColor: "$accent",
    },
  },
});

type Props = {
  children: ReactNode;
};

export const TextInput = ({ children }: Props) => <Wrapper>{children}</Wrapper>;

TextInput.Input = Input;
TextInput.IconButton = IconButton;
