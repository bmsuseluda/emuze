import { styled } from "../../../styled-system/jsx/index.js";
import type { ReactNode } from "react";

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

    maxWidth: "80vw",
    maxHeight: "85vh",

    transition: "max-width 0.5s ease-in-out",
    animation: "scaleUp 150ms",
    overflow: "clip",
    "&:focus": { outline: "none" },
    borderColor: "sidebarBackgroundColor",
  },
});

export interface DialogCloseEvent {
  preventDefault: () => void;
  stopPropagation: () => void;
}

interface Props {
  children: ReactNode;
  onClose: (event?: DialogCloseEvent) => void;
}

export const GameDialog = ({ children, onClose }: Props) => {
  const handleClose = (event?: DialogCloseEvent) => {
    event?.stopPropagation();
    onClose?.(event);
  };

  return (
    <DialogOverlay onClick={handleClose}>
      <DialogContent
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </DialogContent>
    </DialogOverlay>
  );
};
