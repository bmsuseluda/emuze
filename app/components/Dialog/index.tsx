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
  },
});

const DialogContent = styled("div", {
  base: {
    backgroundColor: "sidebarBackgroundColor",
    color: "color",
    boxShadow: "0px 0px 20px 10px black",
    borderRounded: true,
    borderWidth: "0.2rem",
    borderColor: "sidebarBackgroundColor",

    width: "55rem",
    maxWidth: "90vw",
    height: "60vh",
    maxHeight: "90vh",
    animation: "scaleUp 150ms",
    "&:focus": { outline: "none" },
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

export type DialogCloseEvent = {
  preventDefault: () => void;
  stopPropagation: () => void;
};

type Props = {
  children: ReactNode;
  open: boolean;
  onClose: (event?: DialogCloseEvent) => void;
  closable?: boolean;
};

export const Dialog = ({ children, open, onClose, closable = true }: Props) => {
  const handleClose = (event?: DialogCloseEvent) => {
    event?.stopPropagation();
    if (closable) {
      onClose(event);
    } else {
      event?.preventDefault();
    }
  };

  return (
    <DialogOverlay onClick={handleClose}>
      <DialogContent
        onClick={(event) => {
          event.stopPropagation();
        }}
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
};
