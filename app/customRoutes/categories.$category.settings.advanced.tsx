import type { ComponentRef, MouseEvent } from "react";
import { useCallback, useRef } from "react";
import type { ActionFunction } from "react-router";
import { Form, Outlet, useLoaderData } from "react-router";
import { FormBox } from "../components/FormBox/index.js";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout/index.js";
import { SettingsIcon } from "../components/SettingsIcon/index.js";
import { useFocus } from "../hooks/useFocus/index.js";
import type { FocusElement } from "../types/focusElement.js";
import type { Result } from "../hooks/useGamepadsOnGrid/index.js";
import { useGamepadsOnGrid } from "../hooks/useGamepadsOnGrid/index.js";
import { CreateSystemFoldersDialogContainer } from "../containers/CreateSystemFoldersDialog/index.js";
import { Button } from "../components/Button/index.js";
import { CheckboxRow } from "../containers/CheckboxRow/index.js";
import {
  useInputBack,
  useInputConfirmation,
} from "../hooks/useDirectionalInput/index.js";
import { readAdvanced, writeAdvanced } from "../server/settings.server.js";
import type { Advanced } from "../types/jsonFiles/settings/advanced.js";

export const loader = () => {
  const advanced = readAdvanced();
  return advanced;
};

const actionIds = {
  save: "save",
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const _actionId = form.get("_actionId");
  const eden = form.get("eden") === "on";
  const rmg = form.get("rmg") === "on";

  if (_actionId === actionIds.save) {
    const fields: Advanced = {
      eden,
      rmg,
    };
    writeAdvanced(fields);
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

export default function General() {
  const { eden, rmg } = useLoaderData<typeof loader>();

  const saveButtonRef = useRef<ComponentRef<"button">>(null);
  const { isInFocus, switchFocusBack, switchFocus } =
    useFocus<FocusElement>(focus);

  const selectEntry = useCallback((entry: ComponentRef<"button">) => {
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
    ({ resetSelected }: Result<ComponentRef<"button">>) => {
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
    (event: MouseEvent<ComponentRef<"button">>) => {
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
    <>
      <ListActionBarLayout
        headline={{
          title: "Advanced",
          icon: <SettingsIcon id="advanced" />,
        }}
      >
        <Form method="POST">
          <ListActionBarLayout.ListActionBarContainer
            scrollSmooth
            list={
              <FormBox ref={entryListRef}>
                <li>
                  <CheckboxRow
                    id="eden"
                    name="eden"
                    defaultChecked={eden}
                    ref={entriesRefCallback(0)}
                    onCheckedChange={onSave}
                    onClick={onClick}
                    aria-label="Use Eden instead of Ryujinx to play Nintendo Switch"
                  />
                </li>
                <li>
                  <CheckboxRow
                    id="rmg"
                    name="rmg"
                    defaultChecked={rmg}
                    ref={entriesRefCallback(1)}
                    onCheckedChange={onSave}
                    onClick={onClick}
                    aria-label="Use RMG instead of ares to play Nintendo 64"
                  />
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
      <CreateSystemFoldersDialogContainer />
      <Outlet />
    </>
  );
}
