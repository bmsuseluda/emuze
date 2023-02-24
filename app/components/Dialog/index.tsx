import * as RadixDialog from "@radix-ui/react-dialog";
import { VscChromeClose } from "react-icons/vsc";
import { styled } from "~/stitches";
import { keyframes } from "@stitches/react";
import type { ReactNode } from "react";

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const DialogOverlay = styled(RadixDialog.Overlay, {
  backgroundColor: "$transparentBackgroundColor",
  position: "fixed",
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const DialogContent = styled(RadixDialog.Content, {
  backgroundColor: "$sidebarBackgroundColor",
  color: "$color",
  boxShadow: "0px 0px 20px 10px black",
  borderStyle: "solid",
  borderWidth: "0.2rem",
  borderColor: "$sidebarBackgroundColor",
  borderRadius: "$1",
  overflow: "clip",

  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "55rem",
  maxWidth: "90vw",
  height: "60vh",
  maxHeight: "90vh",
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  "&:focus": { outline: "none" },
});

const IconButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  color: "$color",
  position: "absolute",
  top: 10,
  right: 10,
  cursor: "pointer",
});

type Props = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
};

export const Dialog = ({ children, open, onClose }: Props) => (
  <RadixDialog.Root open={open}>
    <DialogOverlay onClick={onClose} />
    <DialogContent
      onOpenAutoFocus={(event: Event) => {
        event.preventDefault();
      }}
    >
      {children}
      <RadixDialog.Close asChild onClick={onClose}>
        <IconButton aria-label="Close">
          <VscChromeClose />
        </IconButton>
      </RadixDialog.Close>
    </DialogContent>
  </RadixDialog.Root>
);
