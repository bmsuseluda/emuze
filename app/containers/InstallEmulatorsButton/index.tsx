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
import { useGamepadConnected } from "../../hooks/useGamepadConnected/index.js";

export const installMissingApplicationsActionId = "installMissingApplications";

interface Props {
  isInFocus: boolean;
}

export const InstallEmulatorsButton = ({ isInFocus }: Props) => {
  const { state, formData } = useNavigation();
  useInstallEmulatorsButton(isInFocus);
  const { gamepadType } = useGamepadConnected();

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
