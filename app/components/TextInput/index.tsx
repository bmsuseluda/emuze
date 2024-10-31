import type { ReactNode } from "react";
import { styled } from "../../../styled-system/jsx";

import { MdErrorOutline } from "react-icons/md";
import { Typography } from "../Typography";

const Input = styled("input", {
  base: {
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: "sidebarBackgroundColor",
    backgroundColor: "backgroundColor",
    color: "color",
    paddingTop: "1",
    paddingBottom: "1",
    paddingLeft: "1",
    borderRadius: "1",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    fontSize: "100%",
    fontWeight: 400,

    "&:focus": {
      borderColor: "accent",
    },
  },

  variants: {
    iconButton: {
      true: {
        paddingRight: "3",
      },
      false: {
        paddingRight: "1",
      },
    },
  },
});

const IconButton = styled("button", {
  base: {
    position: "absolute",
    right: "1rem",
    top: "50%",
    transform: "translate(0, -50%)",
    marginTop: "auto",
    marginBottom: "auto",
    cursor: "pointer",
    color: "color",

    "&:focus": {
      border: "none",
      outline: "none",
    },

    "& > svg": {
      width: "1.3rem",
      aspectRatio: "1",
      verticalAlign: "middle",
      flexShrink: "0",
    },
  },
});

const Error = styled("p", {
  base: {
    color: "error",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    flexWrap: "nowrap",

    "& > svg": {
      width: "1.3rem",
      aspectRatio: "1",
      verticalAlign: "middle",
      flexShrink: "0",
    },
  },
});

interface ErrorMessageProps {
  children: string;
}

const ErrorMessage = ({ children }: ErrorMessageProps) => (
  <Error>
    <MdErrorOutline />
    <Typography>{children}</Typography>
  </Error>
);

const Wrapper = styled("div", {
  base: {
    display: "flex",
    gap: "0.5rem",
    flexDirection: "column",
  },
});

const ChildrenWrapper = styled("div", {
  base: {
    position: "relative",

    "&:focus-within": {
      "& > input": {
        borderColor: "accent",
      },
    },
  },
});

interface Props {
  children: ReactNode;
  error?: string;
  label?: string;
}

export const TextInput = ({ children, error, label }: Props) => (
  <Wrapper role="group" aria-label={label}>
    <ChildrenWrapper>{children}</ChildrenWrapper>
    {error && <ErrorMessage>{error}</ErrorMessage>}
  </Wrapper>
);

TextInput.Input = Input;
TextInput.IconButton = IconButton;
