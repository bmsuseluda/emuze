import { Button } from "../../components/Button/index.js";
import { GamepadButtonIcon } from "../../components/GamepadButtonIcon/index.js";
import { useNavigation } from "react-router";
import { LogoPulseModal } from "../../components/LogoPulseModal/index.js";
import { useGamepadConnected } from "../../hooks/useGamepadConnected/index.js";
import {
  createSystemFoldersButtonGamepadButtonId,
  type CreateSystemFoldersButtonId,
} from "./createSystemFoldersButtonId.js";
import { useCreateSystemFoldersButton } from "./useCreateSystemFoldersButton.js";
import { MdOutlineCreateNewFolder } from "react-icons/md";

interface Props {
  isInFocus: boolean;
  id: CreateSystemFoldersButtonId;
}

export const CreateSystemFoldersButton = ({ isInFocus, id }: Props) => {
  const { state, formData } = useNavigation();
  useCreateSystemFoldersButton(isInFocus, id);
  const isCreatingFolders =
    state === "submitting" && formData?.get("_actionId") === id;
  const { gamepadType } = useGamepadConnected();

  return (
    <>
      <Button
        type="submit"
        id={id}
        name="_actionId"
        value={id}
        icon={
          gamepadType ? (
            <GamepadButtonIcon
              buttonId={createSystemFoldersButtonGamepadButtonId}
              gamepadType={gamepadType}
            />
          ) : (
            <MdOutlineCreateNewFolder />
          )
        }
      >
        Create System Folders
      </Button>
      <LogoPulseModal active={isCreatingFolders} />
    </>
  );
};
