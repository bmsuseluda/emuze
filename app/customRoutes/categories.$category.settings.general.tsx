import type { ComponentRef, MouseEvent } from "react";
import { useCallback } from "react";
import type { ActionFunctionArgs } from "react-router";
import {
  Form,
  Outlet,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router";
import { FormBox } from "../components/FormBox/index.js";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout/index.js";
import {
  importCategories,
  readCategories,
} from "../server/categories.server.js";
import { openFolderDialog } from "../server/openDialog.server.js";
import { readGeneral, writeGeneral } from "../server/settings.server.js";
import type { General } from "../types/jsonFiles/settings/general.js";
import { isWindows } from "../server/operationsystem.server.js";
import { IconChildrenWrapper } from "../components/IconChildrenWrapper/index.js";
import { SettingsIcon } from "../components/SettingsIcon/index.js";
import { useFocus } from "../hooks/useFocus/index.js";
import type { FocusElement } from "../types/focusElement.js";
import type { Result } from "../hooks/useGamepadsOnGrid/index.js";
import { useGamepadsOnGrid } from "../hooks/useGamepadsOnGrid/index.js";
import fs from "node:fs";
import { log } from "../server/debug.server.js";
import type { Category } from "../types/jsonFiles/category.js";
import { readLastPlayed } from "../server/lastPlayed.server.js";
import type { SystemId } from "../server/categoriesDB.server/systemId.js";
import { ImportButton } from "../containers/ImportButton/index.js";
import type { ImportButtonId } from "../containers/ImportButton/importButtonId.js";
import {
  useInputBack,
  useInputConfirmation,
} from "../hooks/useDirectionalInput/index.js";
import { FileDialogInputField } from "../containers/FileDialogTextInput/index.js";
import { Typography } from "../components/Typography/index.js";
import { useEnableFocusAfterAction } from "../hooks/useEnableFocusAfterAction/index.js";
import { useGamepadConnected } from "../hooks/useGamepadConnected/index.js";

export const loader = () => {
  const general: General = readGeneral() || {};
  const categories = readCategories();

  const errors: Errors = {};

  if (general.categoriesPath?.length) {
    validateCategoriesPath(errors, general.categoriesPath);
  }

  return { ...general, isWindows: isWindows(), categories, errors };
};

const importButtonId: ImportButtonId = "importAll";

const actionIds = {
  chooseApplicationsPath: "chooseApplicationsPath",
  chooseCategoriesPath: "chooseCategoriesPath",
  import: importButtonId,
};

type Errors = {
  categoriesPath?: string;
};

const validateCategoriesPath = (errors: Errors, categoriesPath?: string) => {
  const errorCategoriesPath = validatePath(categoriesPathLabel, categoriesPath);
  if (errorCategoriesPath) {
    errors.categoriesPath = errorCategoriesPath;
  }
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
const applicationsPathLabel = "Emulators Path (Optional)";

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

      validateCategoriesPath(errors, categoriesPath);

      if (Object.keys(errors).length > 0) {
        return { errors };
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
        if (!categories || categories?.length === 0) {
          return {
            errors: {
              categoriesPath:
                "No supported Systems were found. The Roms need to be grouped by their System. E.g. 'Final Fantasy VII.chd' needs to be stored in a folder 'Playstation'.",
            },
          };
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

      return {
        applicationsPath,
        categoriesPath,
      };
    }

    if (_actionId === actionIds.chooseApplicationsPath) {
      const newApplicationsPath = await openFolderDialog(
        "Select Emulators Folder",
        typeof applicationsPath === "string" ? applicationsPath : undefined,
      );
      if (newApplicationsPath) {
        return {
          applicationsPath: newApplicationsPath,
          categoriesPath,
        };
      }
    }

    if (_actionId === actionIds.chooseCategoriesPath) {
      const newCategoriesPath = await openFolderDialog(
        "Select Roms Folder",
        categoriesPath,
      );
      if (newCategoriesPath) {
        return {
          applicationsPath,
          categoriesPath: newCategoriesPath,
        };
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

  const { disableGamepads, enableGamepads } = useGamepadConnected();

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
    ({ resetSelected }: Result<ComponentRef<"button">>) => {
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
  useEnableFocusAfterAction(() => {
    setTimeout(() => {
      enableGamepads();
    }, 100);
  }, [actionIds.chooseApplicationsPath, actionIds.chooseCategoriesPath]);

  const onOpenFileDialog = useCallback(
    (event: MouseEvent<ComponentRef<"button">>) => {
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
                <li>
                  <FileDialogInputField
                    id="categoriesPath"
                    label={categoriesPathLabel}
                    defaultValue={defaultData?.categoriesPath}
                    newValue={newData?.categoriesPath}
                    defaultError={defaultData.errors.categoriesPath}
                    newError={newData?.errors?.categoriesPath}
                    actionId={actionIds.chooseCategoriesPath}
                    openDialogButtonRef={entriesRefCallback(0)}
                    onOpenFileDialog={onOpenFileDialog}
                  />
                </li>
                {defaultData.isWindows && (
                  <li>
                    <FileDialogInputField
                      id="applicationsPath"
                      label={applicationsPathLabel}
                      defaultValue={defaultData?.applicationsPath}
                      newValue={newData?.applicationsPath}
                      actionId={actionIds.chooseApplicationsPath}
                      openDialogButtonRef={entriesRefCallback(1)}
                      onOpenFileDialog={onOpenFileDialog}
                    />
                  </li>
                )}
              </FormBox>
            }
            actions={
              <>
                <ImportButton isInFocus={isInFocus} id={actionIds.import}>
                  Import all
                </ImportButton>
              </>
            }
          />
        </Form>
      </ListActionBarLayout>
      <Outlet />
    </>
  );
}
