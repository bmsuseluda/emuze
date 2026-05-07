import { redirect, useLoaderData, useSubmit } from "react-router";
import { useFocus } from "../hooks/useFocus/index.js";
import type { FocusElement } from "../types/focusElement.js";
import type { ComponentRef } from "react";
import { useCallback, useEffect, useRef } from "react";
import {
  useDirectionalInputDown,
  useDirectionalInputUp,
  useInputBack,
  useInputConfirmation,
  useInputSettings,
} from "../hooks/useDirectionalInput/index.js";
import { ReleaseNotesDialog } from "../components/ReleaseNotesDialog/index.js";
import { loadChangelog } from "../server/changelog.server.js";

export const loader = () => {
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

  useEffect(() => {
    if (!isInFocus) {
      enableFocus();
    }
    // Should be executed only once, therefore isInFocus can not be part of the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
