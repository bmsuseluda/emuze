import { Button } from "../../components/Button/index.js";
import { useNavigation } from "react-router";
import {
  installEmulatorsButtonGamepadButtonId,
  installEmulatorsId,
  useInstallEmulatorsButton,
} from "./useInstallEmulatorsButton.js";
import { GamepadButtonIcon } from "../../components/GamepadButtonIcon/index.js";
import { IoMdDownload } from "react-icons/io";
import { LogoPulseModal } from "../../components/LogoPulseModal/index.js";
import type { GamepadType } from "../../types/gamepad.js";

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
              buttonId={installEmulatorsButtonGamepadButtonId}
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
