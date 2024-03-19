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
import { Button } from "~/components/Button";
import { executeApplication } from "~/server/execute.server";
import { importEntries, readCategory } from "~/server/categories.server";
import { GameGridDynamic } from "app/components/GameGrid";
import {
  ListActionBarLayout,
  scrollPadding,
} from "~/components/layouts/ListActionBarLayout";
import { useTestId } from "~/hooks/useTestId";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { SystemIcon } from "app/components/SystemIcon";
import { layout } from "~/hooks/useGamepads/layouts";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElement } from "~/types/focusElement";
import { readAppearance, readGeneral } from "~/server/settings.server";
import { useFullscreen } from "~/hooks/useFullscreen";
import { SettingsLink } from "~/components/SettingsLink";
import { BiError } from "react-icons/bi";
import { Typography } from "~/components/Typography";
import type { DataFunctionArgs } from "~/context";
import { useEnableFocusAfterAction } from "~/hooks/useEnableFocusAfterAction";
import { useGamepadConnected } from "~/hooks/useGamepadConnected";
import { GamepadButtonIcon } from "~/components/GamepadButtonIcon";
import type { SystemId } from "~/server/categoriesDB.server/types";
import fs from "fs";
import nodepath from "path";

export const loader = ({ params }: DataFunctionArgs) => {
  const { category } = params;
  if (!category) {
    console.log("category empty");
    throw Error("category empty");
  }

  const categoryData = readCategory(category as SystemId);

  if (!categoryData?.name) {
    throw redirect("settings");
  }

  const { alwaysGameNames } = readAppearance();
  return json({ categoryData, alwaysGameNames });
};

const actionIds = {
  launch: "launch",
  import: "import",
};

export const action: ActionFunction = async ({ request, params }) => {
  const { category } = params;
  if (!category) {
    console.log("category empty");
    throw Error("category empty");
  }

  const general = readGeneral();
  const categoryData = readCategory(category as SystemId);

  if (
    !general?.categoriesPath ||
    !categoryData?.name ||
    !fs.existsSync(nodepath.join(general.categoriesPath, categoryData.name))
  ) {
    throw redirect("settings");
  }

  const form = await request.formData();
  const _actionId = form.get("_actionId");

  if (_actionId === actionIds.launch) {
    const game = form.get("game");
    if (typeof game === "string") {
      try {
        executeApplication(category as SystemId, game);
        return { ok: true };
      } catch (e) {
        throw redirect("errorDialog");
      }
    }
  }

  if (_actionId === actionIds.import) {
    await importEntries(category as SystemId);
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
  const { categoryData, alwaysGameNames } = useLoaderData<typeof loader>();

  const isFullscreen = useFullscreen();
  const launchButtonRef = useRef<ElementRef<"button">>(null);
  const importButtonRef = useRef<ElementRef<"button">>(null);
  const settingsButtonRef = useRef<ElementRef<"a">>(null);
  const listRef = useRef<ElementRef<"div">>(null);

  const { getTestId } = useTestId("category");
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

  const onSettings = useCallback(() => {
    if (isInFocus) {
      settingsButtonRef.current?.click();
    }
  }, [isInFocus]);

  useGamepadButtonPressEvent(layout.buttons.X, onImport);
  useGamepadButtonPressEvent(layout.buttons.Start, onSettings);

  useKeyboardEvent("i", onImport);
  useKeyboardEvent("Escape", onSettings);

  const onEntryClick = useCallback(() => {
    if (listRef?.current) {
      // Remove scrollPadding if entry is clicked by mouse to prevent centering the element, otherwise it would be difficult to double click a entry.
      listRef.current.style.scrollPadding = "inherit";
    }

    if (!isInFocus) {
      switchFocus("main");
      enableGamepads();
    }
  }, [isInFocus, enableGamepads, switchFocus]);

  const onSelectEntryByGamepad = useCallback(() => {
    if (listRef?.current) {
      // Add scrollPadding if entry was selected by gamepad to center the element.
      listRef.current.style.scrollPadding = scrollPadding;
    }
  }, []);

  if (!categoryData) {
    return null;
  }

  const { id, name, entries, application } = categoryData;

  return (
    <>
      <ListActionBarLayout
        key={id}
        headline={
          <IconChildrenWrapper>
            <SystemIcon id={id} />
            <Typography {...getTestId("name")}>{name}</Typography>
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
                  onSelectGameByGamepad={onSelectEntryByGamepad}
                  {...getTestId("entries")}
                />
              )
            }
            actions={
              <>
                <Button
                  type="submit"
                  name="_actionId"
                  disabled={!entries || entries.length === 0 || !application}
                  value={actionIds.launch}
                  ref={launchButtonRef}
                  {...getTestId(["button", "launch"])}
                  icon={
                    !application ? (
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
                  {!application ? "No installed Emulators" : "Launch Game"}
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
                  {...getTestId(["button", "import"])}
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
      <SettingsLink
        isFullscreen={isFullscreen}
        onClick={() => {
          switchFocus("settingsSidebar");
        }}
        ref={settingsButtonRef}
      />
      <Outlet />
    </>
  );
}
