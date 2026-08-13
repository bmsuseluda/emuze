import { Button } from "../../components/Button/index.js";
import { GamepadButtonIcon } from "../../components/GamepadButtonIcon/index.js";
import { IoMdRefresh } from "react-icons/io";
import { useNavigation } from "react-router";
import { useImportButton } from "./useImportButton.js";
import type { ImportButtonId } from "./importButtonId.js";
import { importButtonGamepadButtonId } from "./importButtonId.js";
import { LogoPulseModal } from "../../components/LogoPulseModal/index.js";
import { useGamepadConnected } from "../../hooks/useGamepadConnected/index.js";

interface Props {
  isInFocus: boolean;
  id: ImportButtonId;
}

export const ImportButton = ({ isInFocus, id }: Props) => {
  const { state, formData } = useNavigation();
  useImportButton(isInFocus, id);
  const isImporting =
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
              buttonId={importButtonGamepadButtonId}
              gamepadType={gamepadType}
            />
          ) : (
            <IoMdRefresh />
          )
        }
      >
        Import Games
      </Button>
      <LogoPulseModal active={isImporting} />
    </>
  );
};
