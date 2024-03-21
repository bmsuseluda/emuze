import type { ElementRef } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { IoMdDownload, IoMdRefresh } from "react-icons/io";
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
import { useEnableFocusAfterAction } from "~/hooks/useEnableFocusAfterAction";
import { useGamepadConnected } from "~/hooks/useGamepadConnected";
import { GamepadButtonIcon } from "~/components/GamepadButtonIcon";
import fs from "fs";

export const loader = () => {
  const general: General = readGeneral() || {};
  const categories = readCategories();

  const errors: Errors = {};

  if (
    isWindows() &&
    general.applicationsPath &&
    general.applicationsPath.length > 0
  ) {
    const errorApplicationsPath = validatePathExist(
      applicationsPathLabel,
      general.applicationsPath,
    );
    if (errorApplicationsPath) {
      errors.applicationsPath = errorApplicationsPath;
    }
  }
  if (general.categoriesPath && general.categoriesPath.length > 0) {
    const errorCategoriesPath = validatePathExist(
      categoriesPathLabel,
      general.categoriesPath,
    );
    if (errorCategoriesPath) {
      errors.categoriesPath = errorCategoriesPath;
    }
  }

  return json({ ...general, isWindows: isWindows(), categories, errors });
};

const actionIds = {
  chooseApplicationsPath: "chooseApplicationsPath",
  chooseCategoriesPath: "chooseCategoriesPath",
  importAll: "importAll",
  installMissingApplications: "installMissingApplications",
};

type Errors = {
  applicationsPath?: string;
  categoriesPath?: string;
};

const validatePathRequired = (label: string, path?: string) => {
  if (!path || path.length === 0) {
    return `The ${label} is missing`;
  }

  return undefined;
};

const validatePathExist = (label: string, path?: string) => {
  if (!path || !fs.existsSync(path)) {
    return `The ${label} does not exist`;
  }

  return undefined;
};

const validatePath = (label: string, path?: string) => {
  const errorPathRequired = validatePathRequired(label, path);
  if (errorPathRequired) {
    return errorPathRequired;
  }
  const errorPathExist = validatePathExist(label, path);
  if (errorPathExist) {
    return errorPathExist;
  }

  return undefined;
};

const categoriesPathLabel = "Roms Path";
const applicationsPathLabel = "Emulators Path";

type ActionReturn = {
  applicationsPath?: string;
  categoriesPath?: string;
  errors?: Errors;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const form = await request.formData();
    const _actionId = form.get("_actionId");
    const applicationsPath = form.get("applicationsPath")?.toString();
    const categoriesPath = form.get("categoriesPath")?.toString();

    if (_actionId === actionIds.importAll) {
      const errors: Errors = {};

      if (isWindows()) {
        const errorApplicationsPath = validatePath(
          applicationsPathLabel,
          applicationsPath,
        );
        if (errorApplicationsPath) {
          errors.applicationsPath = errorApplicationsPath;
        }
      }
      const errorCategoriesPath = validatePath(
        categoriesPathLabel,
        categoriesPath,
      );
      if (errorCategoriesPath) {
        errors.categoriesPath = errorCategoriesPath;
      }

      if (Object.keys(errors).length > 0) {
        return json({ errors });
      }

      const fields: General = {
        applicationsPath:
          isWindows() && typeof applicationsPath === "string"
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
  } catch (e) {
    return redirect("errorDialog");
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
  const newData = useActionData<ActionReturn>();

  const { gamepadType, disableGamepads, enableGamepads } =
    useGamepadConnected();

  // TODO: Maybe create specific files for gamepad controls
  const importAllButtonRef = useRef<ElementRef<"button">>(null);
  const installEmulatorsButtonRef = useRef<ElementRef<"button">>(null);
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

  const onImportAll = useCallback(() => {
    if (isInFocus) {
      importAllButtonRef.current?.click();
    }
  }, [isInFocus]);

  const onInstallEmulators = useCallback(() => {
    if (isInFocus) {
      installEmulatorsButtonRef.current?.click();
    }
  }, [isInFocus]);

  useGamepadButtonPressEvent(layout.buttons.B, onBack);
  useKeyboardEvent("Backspace", onBack);
  useGamepadButtonPressEvent(layout.buttons.A, onToggle);
  useKeyboardEvent("Enter", onToggle);
  useGamepadButtonPressEvent(layout.buttons.X, onImportAll);
  useKeyboardEvent("i", onImportAll);
  useGamepadButtonPressEvent(layout.buttons.Y, onInstallEmulators);

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

  /* Set focus again after open file explorer */
  useEnableFocusAfterAction(enableGamepads, [
    actionIds.chooseApplicationsPath,
    actionIds.chooseCategoriesPath,
  ]);

  const onOpenFileDialog = useCallback(() => {
    disableGamepads();
  }, [disableGamepads]);

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
                    <Label htmlFor="applicationsPath">
                      {applicationsPathLabel}
                    </Label>
                    <TextInput
                      label={applicationsPathLabel}
                      error={
                        defaultData.errors.applicationsPath ||
                        newData?.errors?.applicationsPath
                      }
                    >
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
                        onClick={onOpenFileDialog}
                      >
                        <FaFolderOpen />
                      </TextInput.IconButton>
                    </TextInput>
                  </FormRow>
                </li>
              )}
              <li>
                <FormRow>
                  <Label htmlFor="categoriesPath">{categoriesPathLabel}</Label>
                  <TextInput
                    label={categoriesPathLabel}
                    error={
                      defaultData.errors.categoriesPath ||
                      newData?.errors?.categoriesPath
                    }
                  >
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
                      ref={entriesRefCallback(defaultData.isWindows ? 1 : 0)}
                      onClick={onOpenFileDialog}
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
                value={actionIds.importAll}
                loading={
                  state === "submitting" &&
                  formData?.get("_actionId") === actionIds.importAll
                }
                ref={importAllButtonRef}
                icon={
                  gamepadType ? (
                    <GamepadButtonIcon
                      buttonIndex={layout.buttons.X}
                      gamepadType={gamepadType}
                    />
                  ) : (
                    <IoMdRefresh />
                  )
                }
              >
                Import all
              </Button>
              {!defaultData.isWindows && defaultData.categories.length > 0 && (
                <Button
                  type="submit"
                  name="_actionId"
                  value={actionIds.installMissingApplications}
                  loading={
                    state === "submitting" &&
                    formData?.get("_actionId") ===
                      actionIds.installMissingApplications
                  }
                  ref={installEmulatorsButtonRef}
                  icon={
                    gamepadType ? (
                      <GamepadButtonIcon
                        buttonIndex={layout.buttons.Y}
                        gamepadType={gamepadType}
                      />
                    ) : (
                      <IoMdDownload />
                    )
                  }
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
