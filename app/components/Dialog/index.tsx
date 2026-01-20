import type { ReactNode } from "react";
import { styled } from "../../../styled-system/jsx/index.js";
import { VscChromeClose } from "react-icons/vsc";

const DialogOverlay = styled("div", {
  base: {
    backgroundColor: "transparentBackgroundColor",
    position: "fixed",
    inset: 0,
    animation: "makeOpaque 150ms",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

const DialogContent = styled("div", {
  base: {
    backgroundColor: "sidebarBackgroundColor",
    color: "color",
    boxShadow: "dialog",
    borderRounded: true,
    borderWidth: "3",

    width: "55rem",
    maxWidth: "90vw",
    transition: "max-width 0.5s ease-in-out",
    height: "60vh",
    animation: "scaleUp 150ms",
    overflow: "clip",
    "&:focus": { outline: "none" },
  },

  variants: {
    size: {
      small: {
        maxWidth: "min(43.75rem, 90vw)",
      },
      medium: {
        maxWidth: "min(56.25rem, 90vw)",
      },
      dynamic: {
        width: "fit-content",
        height: "fit-content",
      },
    },
    maxHeight: {
      small: {
        maxHeight: "30rem",
      },
      medium: {
        maxHeight: "90vh",
      },
    },
    variant: {
      default: {
        borderColor: "sidebarBackgroundColor",
      },
      accent: {
        borderColor: "accent",
      },
    },
  },
});

/** Is invisible. Is used to trigger closing programatically */
const CloseButton = styled("button", {
  base: {
    borderRadius: "100%",
    height: 25,
    width: 25,
    color: "color",
    position: "absolute",
    top: 10,
    right: 10,
    cursor: "pointer",
    opacity: 0,
  },
});

export interface DialogCloseEvent {
  preventDefault: () => void;
  stopPropagation: () => void;
}

interface Props {
  children: ReactNode;
  open: boolean;
  onClose: (event?: DialogCloseEvent) => void;
  closable?: boolean;
  size?: "small" | "medium" | "dynamic";
  maxHeight?: "small" | "medium";
  variant?: "default" | "accent";
}

export const Dialog = ({
  children,
  open,
  onClose,
  size = "medium",
  maxHeight = "medium",
  variant = "default",
}: Props) => {
  const handleClose = (event?: DialogCloseEvent) => {
    event?.stopPropagation();
    onClose(event);
  };

  if (open) {
    return (
      <DialogOverlay onClick={handleClose}>
        <DialogContent
          onClick={(event) => {
            event.stopPropagation();
          }}
          size={size}
          maxHeight={maxHeight}
          variant={variant}
        >
          {children}
          <CloseButton aria-label="Close Modal" onClick={handleClose}>
            <VscChromeClose />
          </CloseButton>
        </DialogContent>
      </DialogOverlay>
    );
  }
};
