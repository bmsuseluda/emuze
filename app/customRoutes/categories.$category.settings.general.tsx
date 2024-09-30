import type { ElementRef, MouseEvent } from "react";
import { useCallback } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import { FormBox } from "../components/FormBox";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout";
import { importCategories, readCategories } from "../server/categories.server";
import { openFolderDialog } from "../server/openDialog.server";
import { readGeneral, writeGeneral } from "../server/settings.server";
import type { General } from "../types/jsonFiles/settings/general";
import { isWindows } from "../server/operationsystem.server";
import { IconChildrenWrapper } from "../components/IconChildrenWrapper";
import { SettingsIcon } from "../components/SettingsIcon";
import { useFocus } from "../hooks/useFocus";
import type { FocusElement } from "../types/focusElement";
import type { Result } from "../hooks/useGamepadsOnGrid";
import { useGamepadsOnGrid } from "../hooks/useGamepadsOnGrid";
import { installMissingApplicationsOnLinux } from "../server/installApplications.server";
import { useEnableFocusAfterAction } from "../hooks/useEnableFocusAfterAction";
import { useGamepadConnected } from "../hooks/useGamepadConnected";
import fs from "fs";
import { log } from "../server/debug.server";
import type { Category } from "../types/jsonFiles/category";
import { readLastPlayed } from "../server/lastPlayed.server";
import type { SystemId } from "../server/categoriesDB.server/systemId";
import { ImportButton } from "../containers/ImportButton";
import {
  InstallEmulatorsButton,
  installMissingApplicationsActionId,
} from "../containers/InstallEmulatorsButton";
import type { ImportButtonId } from "../containers/ImportButton/importButtonId";
import {
  useInputBack,
  useInputConfirmation,
} from "../hooks/useDirectionalInput";
import { FileDialogInputField } from "../containers/FileDialogTextInput";
import { Typography } from "../components/Typography";

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

const importButtonId: ImportButtonId = "importAll";

const actionIds = {
  chooseApplicationsPath: "chooseApplicationsPath",
  chooseCategoriesPath: "chooseCategoriesPath",
  import: importButtonId,
  installMissingApplications: installMissingApplicationsActionId,
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

const findCategoryToRedirect = (
  categories: Category[],
  systemId?: SystemId,
): SystemId => {
  const isSystemAvailable =
    systemId && categories.find((category) => category.id === systemId);
  const isLastPlayedAvailable = readLastPlayed().length > 0;

  if (isSystemAvailable) {
    return systemId;
  } else if (isLastPlayedAvailable) {
    return "lastPlayed";
  }

  return categories[0].id;
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { category: systemId } = params as { category: SystemId };

  try {
    const form = await request.formData();
    const _actionId = form.get("_actionId");
    const applicationsPath = form.get("applicationsPath")?.toString();
    const categoriesPath = form.get("categoriesPath")?.toString();

    if (_actionId === actionIds.import) {
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
      try {
        await importCategories();
        const categories = readCategories();

        if (categories?.length > 0) {
          return redirect(
            `/categories/${findCategoryToRedirect(categories, systemId)}/settings/general`,
          );
        }
      } catch (error) {
        const categories = readCategories();

        if (categories?.length > 0) {
          return redirect(
            `/categories/${findCategoryToRedirect(categories, systemId)}/settings/general/errorDialog`,
          );
        } else {
          throw error;
        }
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
    log("error", "general action", e);
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

const focus: FocusElement = "settingsMain";

export default function General() {
  const defaultData = useLoaderData<typeof loader>();
  const newData = useActionData<ActionReturn>();

  const { gamepadType, disableGamepads, enableGamepads } =
    useGamepadConnected();

  // TODO: Maybe create specific files for gamepad controls
  const { isInFocus, switchFocusBack, switchFocus } =
    useFocus<FocusElement>(focus);

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

  useInputConfirmation(onToggle);
  useInputBack(onBack);

  /* Set focus again after open file explorer */
  useEnableFocusAfterAction(enableGamepads, [
    actionIds.chooseApplicationsPath,
    actionIds.chooseCategoriesPath,
  ]);

  const onOpenFileDialog = useCallback(
    (event: MouseEvent<ElementRef<"button">>) => {
      if (!isInFocus) {
        switchFocus(focus);
        selectedEntry.current = event.currentTarget;
        updatePosition();
      }
      disableGamepads();
    },
    [disableGamepads, isInFocus, selectedEntry, switchFocus, updatePosition],
  );

  return (
    <>
      <ListActionBarLayout
        headline={
          <IconChildrenWrapper>
            <SettingsIcon id="general" />
            <Typography ellipsis>General</Typography>
          </IconChildrenWrapper>
        }
      >
        <Form method="POST">
          <ListActionBarLayout.ListActionBarContainer
            list={
              <FormBox ref={entryListRef}>
                {defaultData.isWindows && (
                  <li>
                    <FileDialogInputField
                      id="applicationsPath"
                      label={applicationsPathLabel}
                      defaultValue={defaultData?.applicationsPath}
                      newValue={newData?.applicationsPath}
                      defaultError={defaultData.errors.applicationsPath}
                      newError={newData?.errors?.applicationsPath}
                      actionId={actionIds.chooseApplicationsPath}
                      openDialogButtonRef={entriesRefCallback(0)}
                      onOpenFileDialog={onOpenFileDialog}
                    />
                  </li>
                )}
                <li>
                  <FileDialogInputField
                    id="categoriesPath"
                    label={categoriesPathLabel}
                    defaultValue={defaultData?.categoriesPath}
                    newValue={newData?.categoriesPath}
                    defaultError={defaultData.errors.categoriesPath}
                    newError={newData?.errors?.categoriesPath}
                    actionId={actionIds.chooseCategoriesPath}
                    openDialogButtonRef={entriesRefCallback(
                      defaultData.isWindows ? 1 : 0,
                    )}
                    onOpenFileDialog={onOpenFileDialog}
                  />
                </li>
              </FormBox>
            }
            actions={
              <>
                <ImportButton
                  gamepadType={gamepadType}
                  isInFocus={isInFocus}
                  id={actionIds.import}
                >
                  Import all
                </ImportButton>

                {!defaultData.isWindows &&
                  defaultData.categories.length > 0 && (
                    <InstallEmulatorsButton
                      gamepadType={gamepadType}
                      isInFocus={isInFocus}
                    />
                  )}
              </>
            }
          />
        </Form>
      </ListActionBarLayout>
      <Outlet />
    </>
  );
}
