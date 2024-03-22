import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { IoMdSave } from "react-icons/io";
import { Form, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/Button";
import { FormBox } from "~/components/FormBox";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { readAppearance, writeAppearance } from "~/server/settings.server";
import { Checkbox } from "~/components/Checkbox";
import type { Appearance } from "~/types/jsonFiles/settings/appearance";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { SettingsIcon } from "~/components/SettingsIcon";
import { useFullscreen } from "~/hooks/useFullscreen";
import { CheckboxLabel } from "~/components/CheckboxLabel";
import type { ElementRef } from "react";
import { useCallback, useRef } from "react";
import type { Result } from "~/hooks/useGamepadsOnGrid";
import { useGamepadsOnGrid } from "~/hooks/useGamepadsOnGrid";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElement } from "~/types/focusElement";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import { useGamepadConnected } from "~/hooks/useGamepadConnected";
import { GamepadButtonIcon } from "~/components/GamepadButtonIcon";

export const loader = () => {
  const appearance = readAppearance();
  return json(appearance);
};

const actionIds = {
  save: "save",
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const _actionId = form.get("_actionId");
  const fullscreen = form.get("fullscreen") === "on";
  const alwaysGameNames = form.get("alwaysGameNames") === "on";
  const collapseSidebar = form.get("collapseSidebar") === "on";

  if (_actionId === actionIds.save) {
    const fields: Appearance = {
      fullscreen,
      alwaysGameNames,
      collapseSidebar,
    };
    writeAppearance(fields);
  }

  return null;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return (
    <>
      <h2>Error!</h2>
      <p>{error.message}</p>
    </>
  );
};

export default function Index() {
  const { alwaysGameNames, collapseSidebar } = useLoaderData<typeof loader>();
  const fullscreen = useFullscreen();

  const { gamepadType } = useGamepadConnected();

  const saveButtonRef = useRef<ElementRef<"button">>(null);
  const { isInFocus, switchFocusBack } = useFocus<FocusElement>("settingsMain");

  const selectEntry = useCallback((entry: ElementRef<"button">) => {
    entry.focus();
  }, []);

  const goBack = useCallback(
    (resetSelected: () => void) => {
      resetSelected();
      switchFocusBack();
    },
    [switchFocusBack],
  );

  const onLeftOverTheEdge = useCallback(
    ({ resetSelected }: Result<ElementRef<"button">>) => {
      goBack(resetSelected);
    },
    [goBack],
  );

  const { entryListRef, entriesRefCallback, selectedEntry, resetSelected } =
    useGamepadsOnGrid({
      onSelectEntry: selectEntry,
      isInFocus,
      onLeftOverTheEdge,
    });

  const onBack = useCallback(() => {
    if (isInFocus) {
      goBack(resetSelected);
    }
  }, [isInFocus, resetSelected, goBack]);

  const onToggle = useCallback(() => {
    if (isInFocus) {
      selectedEntry.current?.click();
    }
  }, [isInFocus, selectedEntry]);

  const onSave = useCallback(() => {
    if (isInFocus) {
      saveButtonRef.current?.click();
    }
  }, [isInFocus]);

  useGamepadButtonPressEvent(layout.buttons.B, onBack);
  useKeyboardEvent("Backspace", onBack);
  useGamepadButtonPressEvent(layout.buttons.A, onToggle);
  useKeyboardEvent("Enter", onToggle);
  useGamepadButtonPressEvent(layout.buttons.X, onSave);
  useKeyboardEvent("s", onSave);

  return (
    <ListActionBarLayout
      headline={
        <IconChildrenWrapper>
          <SettingsIcon id="appearance" />
          <span>
            <span>Appearance</span>
          </span>
        </IconChildrenWrapper>
      }
    >
      <Form method="POST">
        <ListActionBarLayout.ListActionBarContainer
          scrollSmooth
          list={
            <FormBox ref={entryListRef}>
              <li>
                <CheckboxLabel>
                  <Checkbox
                    id="fullscreen"
                    name="fullscreen"
                    checked={fullscreen}
                    onClick={() =>
                      window.electronAPI &&
                      window.electronAPI.changeWindow("fullscreen")
                    }
                    ref={entriesRefCallback(0)}
                  />
                  Fullscreen
                </CheckboxLabel>
              </li>
              <li>
                <CheckboxLabel>
                  <Checkbox
                    id="alwaysGameNames"
                    name="alwaysGameNames"
                    defaultChecked={alwaysGameNames}
                    ref={entriesRefCallback(1)}
                  />
                  Always show game names
                </CheckboxLabel>
              </li>
              <li>
                <CheckboxLabel>
                  <Checkbox
                    id="collapseSidebar"
                    name="collapseSidebar"
                    defaultChecked={collapseSidebar}
                    ref={entriesRefCallback(2)}
                  />
                  Collapse sidebar
                </CheckboxLabel>
              </li>
            </FormBox>
          }
          actions={
            <Button
              type="submit"
              name="_actionId"
              value={actionIds.save}
              ref={saveButtonRef}
              icon={
                gamepadType ? (
                  <GamepadButtonIcon
                    buttonIndex={layout.buttons.X}
                    gamepadType={gamepadType}
                  />
                ) : (
                  <IoMdSave />
                )
              }
            >
              Save settings
            </Button>
          }
        />
      </Form>
    </ListActionBarLayout>
  );
}
