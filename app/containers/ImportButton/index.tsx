import { Button } from "../../components/Button/index.js";
import { GamepadButtonIcon } from "../../components/GamepadButtonIcon/index.js";
import { IoMdRefresh } from "react-icons/io";
import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping.js";
import { useNavigation } from "react-router";
import type { ReactNode } from "react";
import { useImportButton } from "./useImportButton.js";
import type { ImportButtonId } from "./importButtonId.js";
import { importButtonGamepadButtonIndex } from "./importButtonId.js";
import { LogoPulseModal } from "../../components/LogoPulseModal/index.js";

interface Props {
  gamepadType?: GamepadType;
  children: ReactNode;
  isInFocus: boolean;
  id: ImportButtonId;
}

export const ImportButton = ({
  gamepadType,
  isInFocus,
  children,
  id,
}: Props) => {
  const { state, formData } = useNavigation();
  useImportButton(isInFocus, id);
  const isImporting =
    state === "submitting" && formData?.get("_actionId") === id;

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
              buttonIndex={importButtonGamepadButtonIndex}
              gamepadType={gamepadType}
            />
          ) : (
            <IoMdRefresh />
          )
        }
      >
        {children}
      </Button>
      <LogoPulseModal active={isImporting} />
    </>
  );
};
