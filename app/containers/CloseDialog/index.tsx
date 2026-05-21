import { useCallback } from "react";
import { ConfirmationDialogContainer } from "../ConfirmationDialog/index.js";
import { TbCancel } from "react-icons/tb";
import { RiShutDownLine } from "react-icons/ri";

export const CloseDialogContainer = () => {
  const onClose = useCallback(() => {
    if (window.electronAPI) {
      window.electronAPI.closeEmuze();
    }
  }, []);

  return (
    <ConfirmationDialogContainer
      headline="Close emuze?"
      focusElement="closeDialog"
      onConfirm={onClose}
      cancelButtonDefinition={{
        icon: <TbCancel />,
        children: "Cancel",
      }}
      confirmButtonDefinition={{
        icon: <RiShutDownLine />,
        children: "Close",
      }}
    />
  );
};
