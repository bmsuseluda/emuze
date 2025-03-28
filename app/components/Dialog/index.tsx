import { VscChromeClose } from "react-icons/vsc";
import type { ReactNode } from "react";
import { styled } from "../../../styled-system/jsx";

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
    boxShadow: "0px 0px 20px 10px black",
    borderRounded: true,
    borderWidth: "0.2rem",

    width: "55rem",
    maxWidth: "min(900px, 90vw)",
    transition: "max-width 0.5s ease-in-out",
    height: "60vh",
    maxHeight: "90vh",
    animation: "scaleUp 150ms",
    overflow: "clip",
    "&:focus": { outline: "none" },
  },

  variants: {
    smaller: {
      true: {
        maxWidth: "min(700px, 90vw)",
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

const IconButton = styled("button", {
  base: {
    borderRadius: "100%",
    height: 25,
    width: 25,
    color: "color",
    position: "absolute",
    top: 10,
    right: 10,
    cursor: "pointer",
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
  smaller?: boolean;
  variant?: "default" | "accent";
}

export const Dialog = ({
  children,
  open,
  onClose,
  closable = true,
  smaller = false,
  variant = "default",
}: Props) => {
  const handleClose = (event?: DialogCloseEvent) => {
    event?.stopPropagation();
    if (closable) {
      onClose(event);
    } else {
      event?.preventDefault();
    }
  };

  if (open) {
    return (
      <DialogOverlay onClick={handleClose}>
        <DialogContent
          onClick={(event) => {
            event.stopPropagation();
          }}
          smaller={smaller}
          variant={variant}
        >
          {children}
          {closable && (
            <IconButton aria-label="Close Modal" onClick={handleClose}>
              <VscChromeClose />
            </IconButton>
          )}
        </DialogContent>
      </DialogOverlay>
    );
  }
};
