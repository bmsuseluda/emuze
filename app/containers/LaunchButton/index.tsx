import { Button } from "../../components/Button/index.js";
import { GamepadButtonIcon } from "../../components/GamepadButtonIcon/index.js";
import { IoMdPlay } from "react-icons/io";
import type { ComponentRef, RefObject } from "react";
import { LogoPulseModal } from "../../components/LogoPulseModal/index.js";
import { useNavigation } from "react-router";
import type { ButtonId, GamepadType } from "../../types/gamepad.js";

interface Props {
  gamepadType?: GamepadType;
  disabled?: boolean;
  launchButtonRef: RefObject<ComponentRef<"button"> | null>;
}

export const launchId = "launch";
export const launchButtonGamepadButtonId: ButtonId = "a";

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
              buttonId={launchButtonGamepadButtonId}
              gamepadType={gamepadType}
            />
          ) : (
            <IoMdPlay />
          )
        }
      >
        Launch Game
      </Button>
      <LogoPulseModal active={isGameLaunching} />
    </>
  );
};
