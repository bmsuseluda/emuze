import * as RadixDialog from "@radix-ui/react-dialog";
import { VscChromeClose } from "react-icons/vsc";
import type { ReactNode } from "react";
import { styled } from "../../../styled-system/jsx";

const DialogOverlay = styled(RadixDialog.Overlay, {
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

const DialogContent = styled(RadixDialog.Content, {
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

type Props = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
};

export const Dialog = ({ children, open, onClose }: Props) => (
  <RadixDialog.Root open={open}>
    <DialogOverlay>
      <DialogContent
        onOpenAutoFocus={(event: Event) => {
          event.preventDefault();
        }}
        onInteractOutside={onClose}
      >
        {children}
        <RadixDialog.Close asChild onClick={onClose}>
          <IconButton aria-label="Close">
            <VscChromeClose />
          </IconButton>
        </RadixDialog.Close>
      </DialogContent>
    </DialogOverlay>
  </RadixDialog.Root>
);
