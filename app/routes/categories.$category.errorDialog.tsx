import { getErrorDialog, resetErrorDialog } from "~/server/errorDialog.server";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { ErrorDialog } from "~/components/ErrorDialog";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElement } from "~/types/focusElement";
import { useCallback, useEffect } from "react";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";

export const loader = () => {
  const errorDialog = getErrorDialog();

  return json({ errorDialog });
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
  const submit = useSubmit();
  const { switchFocusBack, switchFocus, isInFocus } =
    useFocus<FocusElement>("errorDialog");

  useEffect(() => {
    if (!isInFocus) {
      switchFocus("errorDialog");
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

  useGamepadButtonPressEvent(layout.buttons.X, handleClose);
  useGamepadButtonPressEvent(layout.buttons.B, handleClose);
  useGamepadButtonPressEvent(layout.buttons.Start, handleClose);

  useKeyboardEvent("Enter", handleClose);
  useKeyboardEvent("Escape", handleClose);
  useKeyboardEvent("Backspace", handleClose);

  return <ErrorDialog {...errorDialog} onClose={handleClose} />;
}
