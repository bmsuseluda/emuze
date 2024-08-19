import type { ElementRef } from "react";
import { useCallback, useRef } from "react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { IoMdPlay, IoMdRefresh } from "react-icons/io";
import { Button } from "../components/Button";
import { executeApplication } from "../server/execute.server";
import { importEntries, readCategory } from "../server/categories.server";
import { GameGridDynamic } from "../components/GameGrid";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout";
import { IconChildrenWrapper } from "../components/IconChildrenWrapper";
import { SystemIcon } from "../components/SystemIcon";
import { layout } from "../hooks/useGamepads/layouts";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "../hooks/useGamepadEvent";
import { useFocus } from "../hooks/useFocus";
import type { FocusElement } from "../types/focusElement";
import { readAppearance, readGeneral } from "../server/settings.server";
import { SettingsLink } from "../containers/SettingsLink";
import { BiError } from "react-icons/bi";
import { Typography } from "../components/Typography";
import type { DataFunctionArgs } from "../context";
import { useEnableFocusAfterAction } from "../hooks/useEnableFocusAfterAction";
import { useGamepadConnected } from "../hooks/useGamepadConnected";
import { GamepadButtonIcon } from "../components/GamepadButtonIcon";
import fs from "fs";
import nodepath from "path";
import type { SystemId } from "../server/categoriesDB.server/systemId";
import { log } from "../server/debug.server";
import { categories } from "../server/categoriesDB.server";
import { getInstalledApplicationForCategory } from "../server/applications.server";

export const loader = ({ params }: DataFunctionArgs) => {
  const { category } = params;
  if (!category) {
    log("error", "category empty");
    throw Error("category empty");
  }

  const categoryData = readCategory(category as SystemId);

  if (!categoryData?.name) {
    return redirect("/settings");
  }

  const categoryDB = categories[category as SystemId];
  const applicationsPath = readGeneral()?.applicationsPath;

  try {
    const isApplicationInstalled = !!getInstalledApplicationForCategory({
      categoryDB,
      applicationsPath,
    });

    const { alwaysGameNames } = readAppearance();
    return json({ categoryData, alwaysGameNames, isApplicationInstalled });
  } catch (error) {
    log("debug", "category", "redirect to settings");
    return redirect("/settings");
  }
};

const actionIds = {
  launch: "launch",
  import: "import",
};

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const { category } = params;
    if (!category) {
      log("error", "category empty");
      throw Error("category empty");
    }

    const general = readGeneral();
    const categoryData = readCategory(category as SystemId);

    if (
      !general?.categoriesPath ||
      !categoryData?.name ||
      !fs.existsSync(nodepath.join(general.categoriesPath, categoryData.name))
    ) {
      return redirect("settings");
    }

    const form = await request.formData();
    const _actionId = form.get("_actionId");

    if (_actionId === actionIds.launch) {
      const game = form.get("game");
      if (typeof game === "string") {
        const entryData = categoryData.entries?.find(
          (value) => value.id === game,
        );

        entryData && executeApplication(category as SystemId, entryData);
        return { ok: true };
      }
    }

    if (_actionId === actionIds.import) {
      await importEntries(category as SystemId);
    }
  } catch (e) {
    log("error", "category action", e);
    return redirect("errorDialog");
  }

  return null;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return (
    <>
      <h2>Error!</h2>
      <p>{error?.message}</p>
    </>
  );
};

export const shouldRevalidate = ({
  actionResult,
  defaultShouldRevalidate,
}: {
  actionResult: { ok: boolean };
  defaultShouldRevalidate: boolean;
}) => {
  if (actionResult?.ok) {
    return false;
  }
  return defaultShouldRevalidate;
};

export default function Category() {
  const { categoryData, alwaysGameNames, isApplicationInstalled } =
    useLoaderData<typeof loader>();

  const launchButtonRef = useRef<ElementRef<"button">>(null);
  const importButtonRef = useRef<ElementRef<"button">>(null);
  const listRef = useRef<ElementRef<"div">>(null);

  const { isInFocus, switchFocus, switchFocusBack } =
    useFocus<FocusElement>("main");

  const { state, formData } = useNavigation();

  const { gamepadType, enableGamepads, disableGamepads } =
    useGamepadConnected();

  /* Set focus again after launching */
  useEnableFocusAfterAction(enableGamepads, [actionIds.launch]);

  const onBack = useCallback(() => {
    if (isInFocus) {
      switchFocusBack();
    }
  }, [switchFocusBack, isInFocus]);

  const onExecute = useCallback(() => {
    if (launchButtonRef.current && !launchButtonRef.current.disabled) {
      disableGamepads();
      launchButtonRef.current.click();
    }
  }, [disableGamepads]);

  const onImport = useCallback(() => {
    if (isInFocus) {
      importButtonRef.current?.click();
    }
  }, [isInFocus]);

  useGamepadButtonPressEvent(layout.buttons.X, onImport);
  useKeyboardEvent("i", onImport);

  const onEntryClick = useCallback(() => {
    if (listRef?.current) {
      // Remove scrollPadding if entry is clicked by mouse to prevent centering the element, otherwise it would be difficult to double click a entry.
      listRef.current.style.scrollPadding = "inherit";
    }

    if (!isInFocus) {
      switchFocus("main");
      enableGamepads();
    }

    setTimeout(() => {
      if (listRef?.current) {
        // Add scrollPadding if entry was selected by gamepad to center the element.
        // Needs to be in a timeout to reactivate the feature afterwards
        // If you change this value, change it in panda config as well
        listRef.current.style.scrollPadding = "50% 0";
      }
    }, 10);
  }, [isInFocus, enableGamepads, switchFocus]);

  if (!categoryData) {
    return null;
  }

  const { id, name, entries } = categoryData;

  return (
    <>
      <ListActionBarLayout
        key={id}
        headline={
          <IconChildrenWrapper>
            <SystemIcon id={id} />
            <Typography ellipsis>{name}</Typography>
          </IconChildrenWrapper>
        }
      >
        <Form method="POST">
          <ListActionBarLayout.ListActionBarContainer
            scrollSmooth
            ref={listRef}
            list={
              entries && (
                <GameGridDynamic
                  key={id + entries.length}
                  games={entries}
                  alwaysGameNames={alwaysGameNames}
                  onExecute={onExecute}
                  onBack={onBack}
                  isInFocus={isInFocus}
                  onGameClick={onEntryClick}
                />
              )
            }
            actions={
              <>
                <Button
                  type="submit"
                  name="_actionId"
                  disabled={
                    !entries || entries.length === 0 || !isApplicationInstalled
                  }
                  value={actionIds.launch}
                  ref={launchButtonRef}
                  icon={
                    !isApplicationInstalled ? (
                      <BiError />
                    ) : gamepadType ? (
                      <GamepadButtonIcon
                        buttonIndex={layout.buttons.A}
                        gamepadType={gamepadType}
                      />
                    ) : (
                      <IoMdPlay />
                    )
                  }
                >
                  {!isApplicationInstalled
                    ? "Emulator not installed"
                    : "Launch Game"}
                </Button>
                <Button
                  type="submit"
                  name="_actionId"
                  value={actionIds.import}
                  ref={importButtonRef}
                  loading={
                    state === "submitting" &&
                    formData?.get("_actionId") === actionIds.import
                  }
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
                  Import Games
                </Button>
              </>
            }
          />
        </Form>
      </ListActionBarLayout>
      <SettingsLink isInFocus={isInFocus} switchFocus={switchFocus} />
      <Outlet />
    </>
  );
}
