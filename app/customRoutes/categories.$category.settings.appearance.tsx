import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Button } from "../components/Button";
import { FormBox } from "../components/FormBox";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout";
import { readAppearance, writeAppearance } from "../server/settings.server";
import { Checkbox } from "../components/Checkbox";
import type { Appearance } from "../types/jsonFiles/settings/appearance";
import { IconChildrenWrapper } from "../components/IconChildrenWrapper";
import { SettingsIcon } from "../components/SettingsIcon";
import { useFullscreen } from "../hooks/useFullscreen";
import { CheckboxLabel } from "../components/CheckboxLabel";
import type { ElementRef, MouseEvent } from "react";
import { useCallback, useRef } from "react";
import type { Result } from "../hooks/useGamepadsOnGrid";
import { useGamepadsOnGrid } from "../hooks/useGamepadsOnGrid";
import { useFocus } from "../hooks/useFocus";
import type { FocusElement } from "../types/focusElement";
import {
  useInputBack,
  useInputConfirmation,
} from "../hooks/useDirectionalInput";

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

const focus: FocusElement = "settingsMain";

export default function Appearance() {
  const { alwaysGameNames, collapseSidebar } = useLoaderData<typeof loader>();
  const fullscreen = useFullscreen();

  const saveButtonRef = useRef<ElementRef<"button">>(null);
  const { isInFocus, switchFocusBack, switchFocus } =
    useFocus<FocusElement>(focus);

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

  const {
    entryListRef,
    entriesRefCallback,
    selectedEntry,
    resetSelected,
    updatePosition,
  } = useGamepadsOnGrid({
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

  const onClick = useCallback(
    (event: MouseEvent<ElementRef<"button">>) => {
      if (!isInFocus) {
        switchFocus(focus);
        selectedEntry.current = event.currentTarget;
        updatePosition();
      }
    },
    [isInFocus, switchFocus, selectedEntry, updatePosition],
  );

  useInputConfirmation(onToggle);
  useInputBack(onBack);

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
                    ref={entriesRefCallback(0)}
                    onCheckedChange={() => {
                      window.electronAPI &&
                        window.electronAPI.changeWindow("fullscreen");
                    }}
                    onClick={onClick}
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
                    onCheckedChange={onSave}
                    onClick={onClick}
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
                    onCheckedChange={onSave}
                    onClick={onClick}
                  />
                  Collapse sidebar
                </CheckboxLabel>
              </li>
            </FormBox>
          }
        />
        <Button
          type="submit"
          name="_actionId"
          value={actionIds.save}
          ref={saveButtonRef}
          style={{ display: "none" }}
        >
          Save Settings
        </Button>
      </Form>
    </ListActionBarLayout>
  );
}
