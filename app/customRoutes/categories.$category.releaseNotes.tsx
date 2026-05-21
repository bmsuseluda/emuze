import { redirect, useLoaderData, useSubmit } from "react-router";
import { useFocus } from "../hooks/useFocus/index.js";
import type { FocusElement } from "../types/focusElement.js";
import type { ComponentRef } from "react";
import { useCallback, useRef } from "react";
import {
  useDirectionalInputDown,
  useDirectionalInputUp,
  useInputBack,
  useInputConfirmation,
  useInputSettings,
} from "../hooks/useDirectionalInput/index.js";
import { ReleaseNotesDialog } from "../components/ReleaseNotesDialog/index.js";
import { loadChangelog } from "../server/changelog.server.js";
import { readGeneral, writeGeneral } from "../server/settings.server.js";
import { useFocusOnMount } from "../hooks/useFocusOnMount/index.js";

export const loader = () => {
  const general = readGeneral();
  const showReleaseNotesOnStart = general?.showReleaseNotesOnStart;
  if (
    typeof showReleaseNotesOnStart === "undefined" ||
    showReleaseNotesOnStart
  ) {
    writeGeneral({ ...general, showReleaseNotesOnStart: false });
  }
  const releaseNotesMarkdown = loadChangelog();

  return { releaseNotesMarkdown };
};

export const action = () => {
  throw redirect("..");
};

export default function RenderComponent() {
  const { releaseNotesMarkdown } = useLoaderData<typeof loader>();
  const listRef = useRef<ComponentRef<"div">>(null);
  const submit = useSubmit();
  const { switchFocusBack, isInFocus, enableFocus } =
    useFocus<FocusElement>("releaseNotesDialog");

  useFocusOnMount(isInFocus, enableFocus);

  const handleClose = useCallback(() => {
    if (isInFocus) {
      switchFocusBack();
      submit(null, {
        method: "post",
      });
    }
  }, [switchFocusBack, submit, isInFocus]);

  const handleScrollDown = useCallback(() => {
    if (isInFocus && listRef?.current) {
      const scrollHeight = listRef.current.clientHeight;
      const scrollTop = listRef.current.scrollTop;
      listRef.current.scroll({
        behavior: "smooth",
        top: scrollTop + scrollHeight / 2,
      });
    }
  }, [isInFocus]);

  const handleScrollUp = useCallback(() => {
    if (isInFocus && listRef?.current) {
      const scrollHeight = listRef.current.clientHeight;
      const scrollTop = listRef.current.scrollTop;
      listRef.current.scroll({
        behavior: "smooth",
        top: scrollTop - scrollHeight / 2,
      });
    }
  }, [isInFocus]);

  useDirectionalInputUp(handleScrollUp);
  useDirectionalInputDown(handleScrollDown);
  useInputConfirmation(handleClose);
  useInputBack(handleClose);
  useInputSettings(handleClose);

  return (
    <ReleaseNotesDialog
      releaseNotesMarkdown={releaseNotesMarkdown}
      onClose={handleClose}
      listRef={listRef}
    />
  );
}
