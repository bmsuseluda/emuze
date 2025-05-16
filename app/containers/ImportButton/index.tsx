import { Button } from "../../components/Button";
import { GamepadButtonIcon } from "../../components/GamepadButtonIcon";
import { IoMdRefresh } from "react-icons/io";
import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping";
import { useNavigation } from "react-router";
import type { ReactNode } from "react";
import { useImportButton } from "./useImportButton";
import type { ImportButtonId } from "./importButtonId";
import { importButtonGamepadButtonIndex } from "./importButtonId";
import { LogoPulseModal } from "../../components/LogoPulseModal";

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
