import type { ActionFunction } from "react-router";
import { Form, useLoaderData } from "react-router";
import { Button } from "../components/Button/index.js";
import { FormBox } from "../components/FormBox/index.js";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout/index.js";
import { readAppearance, writeAppearance } from "../server/settings.server.js";
import { Checkbox } from "../components/Checkbox/index.js";
import type { Appearance } from "../types/jsonFiles/settings/appearance.js";
import { IconChildrenWrapper } from "../components/IconChildrenWrapper/index.js";
import { SettingsIcon } from "../components/SettingsIcon/index.js";
import { useFullscreen } from "../hooks/useFullscreen/index.js";
import { CheckboxLabel } from "../components/CheckboxLabel/index.js";
import type { ElementRef, MouseEvent } from "react";
import { useCallback, useRef } from "react";
import type { Result } from "../hooks/useGamepadsOnGrid/index.js";
import { useGamepadsOnGrid } from "../hooks/useGamepadsOnGrid/index.js";
import { useFocus } from "../hooks/useFocus/index.js";
import type { FocusElement } from "../types/focusElement.js";
import {
  useInputBack,
  useInputConfirmation,
} from "../hooks/useDirectionalInput/index.js";
import { Typography } from "../components/Typography/index.js";
import { FormRow } from "../components/FormRow/index.js";

export const loader = () => {
  const appearance = readAppearance();
  return appearance;
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
          <Typography ellipsis>Appearance</Typography>
        </IconChildrenWrapper>
      }
    >
      <Form method="POST">
        <ListActionBarLayout.ListActionBarContainer
          scrollSmooth
          list={
            <FormBox ref={entryListRef}>
              <li>
                <FormRow>
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
                </FormRow>
              </li>
              <li>
                <FormRow>
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
                </FormRow>
              </li>
              <li>
                <FormRow>
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
                </FormRow>
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
