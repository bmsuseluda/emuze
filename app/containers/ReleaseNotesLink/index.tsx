import { ReleaseNotesLink as ReleaseNotesLinkComponent } from "../../components/ReleaseNotesLink/index.js";
import { useFullscreen } from "../../hooks/useFullscreen/index.js";
import type { FocusElement } from "../../types/focusElement.js";
import {
  openReleaseNotesId,
  useOpenReleaseNotes,
} from "./useOpenReleaseNotes.js";

interface Props {
  isInFocus: boolean;
  switchFocus: (nextFocusElement: FocusElement) => void;
}

export const ReleaseNotesLinkLink = ({ isInFocus, switchFocus }: Props) => {
  const isFullscreen = useFullscreen();

  useOpenReleaseNotes(isInFocus);

  return (
    <ReleaseNotesLinkComponent
      id={openReleaseNotesId}
      isFullscreen={isFullscreen}
      onClick={() => {
        switchFocus("releaseNotesDialog");
      }}
    />
  );
};
