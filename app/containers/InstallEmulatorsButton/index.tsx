import { Button } from "../../components/Button";
import { useNavigation } from "@remix-run/react";
import {
  installEmulatorsButtonGamepadButtonIndex,
  installEmulatorsId,
  useInstallEmulatorsButton,
} from "./useInstallEmulatorsButton";
import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping";
import { GamepadButtonIcon } from "../../components/GamepadButtonIcon";
import { IoMdDownload } from "react-icons/io";

export const installMissingApplicationsActionId = "installMissingApplications";

interface Props {
  gamepadType?: GamepadType;
  isInFocus: boolean;
}

export const InstallEmulatorsButton = ({ gamepadType, isInFocus }: Props) => {
  const { state, formData } = useNavigation();
  useInstallEmulatorsButton(isInFocus);

  return (
    <Button
      type="submit"
      name="_actionId"
      id={installEmulatorsId}
      value={installMissingApplicationsActionId}
      loading={
        state === "submitting" &&
        formData?.get("_actionId") === installMissingApplicationsActionId
      }
      icon={
        gamepadType ? (
          <GamepadButtonIcon
            buttonIndex={installEmulatorsButtonGamepadButtonIndex}
            gamepadType={gamepadType}
          />
        ) : (
          <IoMdDownload />
        )
      }
    >
      Install Emulators
    </Button>
  );
};
