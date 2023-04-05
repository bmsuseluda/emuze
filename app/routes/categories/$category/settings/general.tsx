import { useCallback, useEffect, useRef, useState } from "react";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { IoMdSave } from "react-icons/io";
import { FaFolderOpen } from "react-icons/fa";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/Button";
import { FormBox } from "~/components/FormBox";
import { FormRow } from "~/components/FormRow";
import { Label } from "~/components/Label";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { importApplications } from "~/server/applications.server";
import { importCategories } from "~/server/categories.server";
import { openFolderDialog } from "~/server/openDialog.server";
import { readGeneral, writeGeneral } from "~/server/settings.server";
import type { General } from "~/types/settings/general";
import { isWindows } from "~/server/operationsystem.server";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { SettingsIcon } from "~/components/SettingsIcon";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElement } from "~/types/focusElement";
import { useRefsGrid } from "~/hooks/useRefsGrid";
import { useGamepadsOnGrid } from "~/hooks/useGamepadsOnGrid";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import { TextInput } from "~/components/TextInput";

export const loader = () => {
  const general: General = readGeneral() || {};
  return json({ ...general, isWindows });
};

const actionIds = {
  chooseApplicationsPath: "chooseApplicationsPath",
  chooseCategoriesPath: "chooseCategoriesPath",
  save: "save",
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const _actionId = form.get("_actionId");
  const applicationsPath = form.get("applicationsPath");
  const categoriesPath = form.get("categoriesPath");

  if (_actionId === actionIds.save) {
    if (
      (isWindows && typeof applicationsPath !== "string") ||
      typeof categoriesPath !== "string"
    ) {
      throw new Error(`Form not submitted correctly.`);
    }

    const fields: General = {
      applicationsPath:
        isWindows && typeof applicationsPath === "string"
          ? applicationsPath
          : null,
      categoriesPath,
    };
    writeGeneral(fields);
    importApplications();
    await importCategories();
    throw redirect("/categories");
  }

  if (_actionId === actionIds.chooseApplicationsPath) {
    const newApplicationsPath = openFolderDialog(
      "Select Emulators Folder",
      typeof applicationsPath === "string" ? applicationsPath : undefined
    );
    if (newApplicationsPath) {
      return json({
        applicationsPath: newApplicationsPath,
        categoriesPath,
      });
    }
  }

  if (_actionId === actionIds.chooseCategoriesPath) {
    const newCategoriesPath = openFolderDialog(
      "Select Roms Folder",
      typeof categoriesPath === "string" ? categoriesPath : undefined
    );
    if (newCategoriesPath) {
      return json({
        applicationsPath,
        categoriesPath: newCategoriesPath,
      });
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

export default function Index() {
  const defaultData = useLoaderData<typeof loader>();
  const newData = useActionData<General>();

  // TODO: Maybe create specific files for gamepad controls
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const entryListRef = useRef<HTMLUListElement>(null);
  const entriesRefs = useRef<HTMLButtonElement[]>([]);
  const { isInFocus, switchFocus } = useFocus<FocusElement>("settingsMain");

  const { entriesRefsGrid } = useRefsGrid(entryListRef, entriesRefs, []);

  const selectEntry = useCallback((entry: HTMLButtonElement) => {
    entry.focus();
  }, []);

  const { selectedEntry, resetSelected } = useGamepadsOnGrid(
    entriesRefsGrid,
    selectEntry,
    isInFocus
  );

  const onBack = useCallback(() => {
    if (isInFocus) {
      resetSelected();
      switchFocus("settingsSidebar");
    }
  }, [isInFocus, resetSelected, switchFocus]);

  const onToggle = useCallback(() => {
    if (isInFocus) {
      selectedEntry.current?.click();
    }
  }, [isInFocus, selectedEntry]);

  const onSave = useCallback(() => {
    if (isInFocus) {
      switchFocus("main");
      saveButtonRef.current?.click();
    }
  }, [isInFocus, switchFocus]);

  useGamepadButtonPressEvent(layout.buttons.B, onBack);
  useKeyboardEvent("Backspace", onBack);
  useGamepadButtonPressEvent(layout.buttons.A, onToggle);
  useKeyboardEvent("Enter", onToggle);
  useGamepadButtonPressEvent(layout.buttons.X, onSave);
  useKeyboardEvent("s", onSave);

  const [applicationPath, setApplicationPath] = useState(
    defaultData.applicationsPath || ""
  );

  useEffect(() => {
    if (newData?.applicationsPath) {
      setApplicationPath(newData?.applicationsPath);
    }
  }, [newData?.applicationsPath]);

  const [categoriesPath, setCategoriesPath] = useState(
    defaultData.categoriesPath || ""
  );

  useEffect(() => {
    if (newData?.categoriesPath) {
      setCategoriesPath(newData?.categoriesPath);
    }
  }, [newData?.categoriesPath]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [newData]);

  return (
    <ListActionBarLayout
      headline={
        <IconChildrenWrapper icon={<SettingsIcon id="general" />}>
          <span>
            <span>General</span>
          </span>
        </IconChildrenWrapper>
      }
    >
      <Form method="post">
        <ListActionBarLayout.ListActionBarContainer
          list={
            <FormBox ref={entryListRef}>
              {defaultData.isWindows && (
                <li>
                  <FormRow>
                    <Label htmlFor="applicationsPath">Emulators Path</Label>
                    <TextInput>
                      <TextInput.Input
                        name="applicationsPath"
                        id="applicationsPath"
                        value={applicationPath}
                        onChange={(event) =>
                          setApplicationPath(event.target.value)
                        }
                        iconButton
                      />
                      <TextInput.IconButton
                        type="submit"
                        name="_actionId"
                        value={actionIds.chooseApplicationsPath}
                        ref={(ref) => {
                          if (ref) {
                            // TODO: fix it
                            entriesRefs.current.push(ref);
                          }
                        }}
                      >
                        <FaFolderOpen />
                      </TextInput.IconButton>
                    </TextInput>
                  </FormRow>
                </li>
              )}
              <li>
                <FormRow>
                  <Label htmlFor="categoriesPath">Roms Path</Label>
                  <TextInput>
                    <TextInput.Input
                      name="categoriesPath"
                      id="categoriesPath"
                      value={categoriesPath}
                      onChange={(event) =>
                        setCategoriesPath(event.target.value)
                      }
                      iconButton
                    />
                    <TextInput.IconButton
                      type="submit"
                      name="_actionId"
                      value={actionIds.chooseCategoriesPath}
                      ref={(ref) => {
                        if (ref) {
                          entriesRefs.current.push(ref);
                        }
                      }}
                    >
                      <FaFolderOpen />
                    </TextInput.IconButton>
                  </TextInput>
                </FormRow>
              </li>
            </FormBox>
          }
          actions={
            <Button
              type="submit"
              name="_actionId"
              value={actionIds.save}
              icon={<IoMdSave />}
              loading={loading}
              onClick={() => {
                setLoading(true);
              }}
              ref={saveButtonRef}
            >
              Save settings and import all
            </Button>
          }
        />
      </Form>
    </ListActionBarLayout>
  );
}
