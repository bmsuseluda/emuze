import { useCallback } from "react";
import { ConfirmationDialogContainer } from "../ConfirmationDialog/index.js";
import { TbCancel } from "react-icons/tb";
import { MdOutlineCreateNewFolder } from "react-icons/md";

export const CreateSystemFoldersDialogContainer = () => {
  const onClose = useCallback(() => {
    if (window.electronAPI) {
      window.electronAPI.closeEmuze();
    }
  }, []);

  return (
    <ConfirmationDialogContainer
      headline="Create System folders?"
      focusElement="createSystemFoldersDialog"
      onConfirm={onClose}
      cancelButtonDefinition={{
        icon: <TbCancel />,
        children: "Cancel",
      }}
      confirmButtonDefinition={{
        icon: <MdOutlineCreateNewFolder />,
        children: "Create folders",
      }}
    />
  );
};
