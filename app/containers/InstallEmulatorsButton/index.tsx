import { Button } from "../../components/Button/index.js";
import { useNavigation } from "react-router";
import {
  installEmulatorsButtonGamepadButtonIndex,
  installEmulatorsId,
  useInstallEmulatorsButton,
} from "./useInstallEmulatorsButton.js";
import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping.js";
import { GamepadButtonIcon } from "../../components/GamepadButtonIcon/index.js";
import { IoMdDownload } from "react-icons/io";
import { LogoPulseModal } from "../../components/LogoPulseModal/index.js";

export const installMissingApplicationsActionId = "installMissingApplications";

interface Props {
  gamepadType?: GamepadType;
  isInFocus: boolean;
}

export const InstallEmulatorsButton = ({ gamepadType, isInFocus }: Props) => {
  const { state, formData } = useNavigation();
  useInstallEmulatorsButton(isInFocus);

  const isInstalling =
    state === "submitting" &&
    formData?.get("_actionId") === installMissingApplicationsActionId;

  return (
    <>
      <Button
        type="submit"
        name="_actionId"
        id={installEmulatorsId}
        value={installMissingApplicationsActionId}
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
      <LogoPulseModal active={isInstalling} />
    </>
  );
};
