import { getErrorDialog, resetErrorDialog } from "../server/errorDialog.server";
import { redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { ErrorDialog } from "../components/ErrorDialog";
import { useFocus } from "../hooks/useFocus";
import type { FocusElement } from "../types/focusElement";
import type { ElementRef } from "react";
import { useCallback, useEffect, useRef } from "react";
import {
  useDirectionalInputDown,
  useDirectionalInputUp,
  useInputBack,
  useInputConfirmation,
  useInputSettings,
} from "../hooks/useDirectionalInput";

export const loader = () => {
  const errorDialog = getErrorDialog();

  return { errorDialog };
};

export const action = () => {
  resetErrorDialog();
  throw redirect("..");
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return (
    <>
      <h2>Error!</h2>
      <p>{error?.message}</p>
    </>
  );
};

export default function RenderComponent() {
  const { errorDialog } = useLoaderData<typeof loader>();
  const listRef = useRef<ElementRef<"div">>(null);
  const submit = useSubmit();
  const { switchFocusBack, isInFocus, enableFocus } =
    useFocus<FocusElement>("errorDialog");

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
    <ErrorDialog {...errorDialog} onClose={handleClose} listRef={listRef} />
  );
}
