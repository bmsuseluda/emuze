import type { ElementRef } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { IoMdDownload, IoMdSave } from "react-icons/io";
import { FaFolderOpen } from "react-icons/fa";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Button } from "~/components/Button";
import { FormBox } from "~/components/FormBox";
import { FormRow } from "~/components/FormRow";
import { Label } from "~/components/Label";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { importCategories, readCategories } from "~/server/categories.server";
import { openFolderDialog } from "~/server/openDialog.server";
import { readGeneral, writeGeneral } from "~/server/settings.server";
import type { General } from "~/types/jsonFiles/settings/general";
import { isWindows } from "~/server/operationsystem.server";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { SettingsIcon } from "~/components/SettingsIcon";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElement } from "~/types/focusElement";
import type { Result } from "~/hooks/useGamepadsOnGrid";
import { useGamepadsOnGrid } from "~/hooks/useGamepadsOnGrid";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import { TextInput } from "~/components/TextInput";
import { installMissingApplicationsOnLinux } from "~/server/applications.server";

export const loader = () => {
  const general: General = readGeneral() || {};
  const categories = readCategories();
  return json({ ...general, isWindows, categories });
};

const actionIds = {
  chooseApplicationsPath: "chooseApplicationsPath",
  chooseCategoriesPath: "chooseCategoriesPath",
  save: "save",
  installMissingApplications: "installMissingApplications",
};

type Errors = {
  applicationsPath?: string;
  categoriesPath?: string;
};

export const action: ActionFunction = async ({ request }) => {
  console.log("action");
  const form = await request.formData();
  const _actionId = form.get("_actionId");
  const applicationsPath = form.get("applicationsPath");
  const categoriesPath = String(form.get("categoriesPath"));

  if (_actionId === actionIds.save) {
    const errors: Errors = {};
    if (
      isWindows &&
      typeof applicationsPath === "string" &&
      applicationsPath.length === 0
    ) {
      errors.applicationsPath = "The Emulators Path is missing";
    }

    if (categoriesPath.length === 0) {
      errors.categoriesPath = "The Roms Path is missing";
    }

    if (Object.keys(errors).length > 0) {
      return json({ errors });
    }

    const fields: General = {
      applicationsPath:
        isWindows && typeof applicationsPath === "string"
          ? applicationsPath
          : undefined,
      categoriesPath,
    };
    writeGeneral(fields);
    await importCategories();

    const categories = readCategories();

    if (categories?.length > 0) {
      throw redirect(`/categories/${categories[0].id}/settings/general`);
    }
  }

  if (_actionId === actionIds.installMissingApplications) {
    await installMissingApplicationsOnLinux();
  }

  if (_actionId === actionIds.chooseApplicationsPath) {
    const newApplicationsPath = openFolderDialog(
      "Select Emulators Folder",
      typeof applicationsPath === "string" ? applicationsPath : undefined,
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
      categoriesPath,
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
  const saveButtonRef = useRef<ElementRef<"button">>(null);
  const { isInFocus, switchFocusBack } = useFocus<FocusElement>("settingsMain");

  const selectEntry = useCallback((entry: HTMLButtonElement) => {
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

  // TODO: check how to align gamepadsGrid navigation with native input usage (use navigation keys in text input)
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

  const [applicationPath, setApplicationPath] = useState(
    defaultData.applicationsPath || "",
  );

  useEffect(() => {
    if (newData?.applicationsPath) {
      setApplicationPath(newData?.applicationsPath);
    }
  }, [newData?.applicationsPath]);

  const [categoriesPath, setCategoriesPath] = useState(
    defaultData.categoriesPath || "",
  );

  useEffect(() => {
    if (newData?.categoriesPath) {
      setCategoriesPath(newData?.categoriesPath);
    }
  }, [newData?.categoriesPath]);

  const { state, formData } = useNavigation();

  return (
    <ListActionBarLayout
      headline={
        <IconChildrenWrapper>
          <SettingsIcon id="general" />
          <span>
            <span>General</span>
          </span>
        </IconChildrenWrapper>
      }
    >
      <Form method="POST">
        <ListActionBarLayout.ListActionBarContainer
          list={
            <FormBox ref={entryListRef}>
              {defaultData.isWindows && (
                <li>
                  <FormRow>
                    <Label htmlFor="applicationsPath">Emulators Path</Label>
                    <TextInput>
                      <TextInput.Input
                        type="text"
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
                        ref={entriesRefCallback(0)}
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
                      type="text"
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
                      ref={entriesRefCallback(isWindows ? 1 : 0)}
                    >
                      <FaFolderOpen />
                    </TextInput.IconButton>
                  </TextInput>
                </FormRow>
              </li>
            </FormBox>
          }
          actions={
            <>
              <Button
                type="submit"
                name="_actionId"
                value={actionIds.save}
                loading={
                  state === "submitting" &&
                  formData?.get("_actionId") === actionIds.save
                }
                ref={saveButtonRef}
                icon={<IoMdSave />}
              >
                Import all
              </Button>
              {!isWindows && defaultData.categories.length > 0 && (
                <Button
                  type="submit"
                  name="_actionId"
                  value={actionIds.installMissingApplications}
                  loading={
                    state === "submitting" &&
                    formData?.get("_actionId") ===
                      actionIds.installMissingApplications
                  }
                  icon={<IoMdDownload />}
                >
                  Install Emulators
                </Button>
              )}
            </>
          }
        />
      </Form>
    </ListActionBarLayout>
  );
}
