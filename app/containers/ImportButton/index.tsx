import { Button } from "../../components/Button";
import { GamepadButtonIcon } from "../../components/GamepadButtonIcon";
import { IoMdRefresh } from "react-icons/io";
import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping";
import { useNavigation } from "@remix-run/react";
import type { ReactNode } from "react";
import { useImportButton } from "./useImportButton";
import type { ImportButtonId } from "./importButtonId";
import { importButtonGamepadButtonIndex } from "./importButtonId";

export const importActionId = "import";

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

  return (
    <Button
      type="submit"
      id={id}
      name="_actionId"
      value={importActionId}
      loading={
        state === "submitting" && formData?.get("_actionId") === importActionId
      }
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
  );
};
