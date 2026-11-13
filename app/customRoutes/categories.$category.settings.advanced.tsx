import type { ComponentRef, MouseEvent } from "react";
import { useCallback, useRef } from "react";
import type { ActionFunction } from "react-router";
import { Form, Outlet } from "react-router";
import { FormBox } from "../components/FormBox/index.js";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout/index.js";
import { SettingsIcon } from "../components/SettingsIcon/index.js";
import { useFocus } from "../hooks/useFocus/index.js";
import type { FocusElement } from "../types/focusElement.js";
import type { Result } from "../hooks/useGamepadsOnGrid/index.js";
import { useGamepadsOnGrid } from "../hooks/useGamepadsOnGrid/index.js";
import { CreateSystemFoldersDialogContainer } from "../containers/CreateSystemFoldersDialog/index.js";
import { Button } from "../components/Button/index.js";
import { GiUpgrade } from "react-icons/gi";
import {
  useInputBack,
  useInputConfirmation,
} from "../hooks/useDirectionalInput/index.js";
import { readAdvanced, writeAdvanced } from "../server/settings.server.js";
import type { Advanced } from "../types/jsonFiles/settings/advanced.js";
import { Route } from "./+types/categories.$category.settings.advanced.js";
import { SelectRow } from "../containers/SelectRow/index.js";
import { SystemId } from "../server/categoriesDB.server/systemId.js";
import { categories } from "../server/categoriesDB.server/index.js";

export const loader = ({ params }: Route.LoaderArgs) => {
  const { category } = params;
  if (category) {
    const systemId = category as SystemId;
    const { settings } = categories[systemId];

    const defaults = readAdvanced()[systemId];

    return {
      settings,
      defaults,
    };
  }

  return {};
};

const actionIds = {
  save: "save",
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const _actionId = form.get("_actionId");

  if (_actionId === actionIds.save) {
    const { category } = params;
    if (category) {
      const systemId = category as SystemId;
      const { settings } = categories[systemId];

      const fields: Advanced = {
        ...readAdvanced(),
        [systemId]: settings?.reduce<Record<string, string>>(
          (accumulator, { id }) => {
            const value = form.get(id) as string;
            accumulator[id] = value;

            return accumulator;
          },
          {} as Record<string, string>,
        ),
      };
      writeAdvanced(fields);
    }
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

export default function Advanced({
  loaderData: { settings, defaults },
}: Route.ComponentProps) {
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
    setSelectedEntry,
  } = useGamepadsOnGrid({
    onSelectEntry: selectEntry,
    isInFocus,
    onLeftOverTheEdge,
    loop: true,
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
    saveButtonRef.current?.click();
  }, []);

  const onClick = useCallback(
    (event: MouseEvent<ComponentRef<"button">>) => {
      if (!isInFocus) {
        switchFocus(focus);
        setSelectedEntry(event.currentTarget);
      }
    },
    [isInFocus, switchFocus, setSelectedEntry],
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
                {settings?.map(({ id, label, options, icon }, index) => (
                  <li key={id}>
                    <SelectRow
                      id={id}
                      label={label}
                      icon={<GiUpgrade />}
                      defaultValue={defaults?.[id]}
                      options={options}
                      ref={entriesRefCallback(index)}
                      onClick={onClick}
                      onChange={onSave}
                    />
                  </li>
                ))}
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
