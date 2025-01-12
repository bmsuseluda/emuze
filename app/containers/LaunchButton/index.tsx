import { Button } from "../../components/Button";
import { GamepadButtonIcon } from "../../components/GamepadButtonIcon";
import { IoMdPlay } from "react-icons/io";
import { layout } from "../../hooks/useGamepads/layouts";
import type { ElementRef, RefObject } from "react";
import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping";
import { LogoPulseModal } from "../../components/LogoPulseModal";
import { useNavigation } from "@remix-run/react";

interface Props {
  gamepadType?: GamepadType;
  disabled?: boolean;
  launchButtonRef: RefObject<ElementRef<"button">>;
}

export const launchId = "launch";
export const launchButtonGamepadButtonIndex = layout.buttons.A;

export const LaunchButton = ({
  gamepadType,
  disabled,
  launchButtonRef,
}: Props) => {
  const { state, formData } = useNavigation();
  const isGameLaunching =
    state === "submitting" && formData?.get("_actionId") === launchId;

  return (
    <>
      <Button
        type="submit"
        name="_actionId"
        disabled={disabled}
        value={launchId}
        ref={launchButtonRef}
        icon={
          gamepadType ? (
            <GamepadButtonIcon
              buttonIndex={launchButtonGamepadButtonIndex}
              gamepadType={gamepadType}
            />
          ) : (
            <IoMdPlay />
          )
        }
      >
        Launch Game
      </Button>
      {isGameLaunching && <LogoPulseModal />}
    </>
  );
};
