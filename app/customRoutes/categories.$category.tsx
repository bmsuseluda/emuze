import type { ElementRef } from "react";
import { useCallback, useRef } from "react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, redirect, useLoaderData } from "@remix-run/react";
import { IoMdPlay } from "react-icons/io";
import { Button } from "../components/Button";
import { executeApplication } from "../server/execute.server";
import { importEntries, readCategory } from "../server/categories.server";
import { GameGridDynamic } from "../components/GameGrid";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout";
import { IconChildrenWrapper } from "../components/IconChildrenWrapper";
import { SystemIcon } from "../components/SystemIcon";
import { layout } from "../hooks/useGamepads/layouts";
import { useFocus } from "../hooks/useFocus";
import type { FocusElement } from "../types/focusElement";
import { readAppearance, readGeneral } from "../server/settings.server";
import { SettingsLink } from "../containers/SettingsLink";
import { Typography } from "../components/Typography";
import type { DataFunctionArgs } from "../context";
import { useEnableFocusAfterAction } from "../hooks/useEnableFocusAfterAction";
import { useGamepadConnected } from "../hooks/useGamepadConnected";
import { GamepadButtonIcon } from "../components/GamepadButtonIcon";
import fs from "fs";
import nodepath from "path";
import type { SystemId } from "../server/categoriesDB.server/systemId";
import { log } from "../server/debug.server";
import { ImportButton } from "../containers/ImportButton";
import type { ImportButtonId } from "../containers/ImportButton/importButtonId";

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

  const { alwaysGameNames } = readAppearance();
  return json({ categoryData, alwaysGameNames });
};

const importButtonId: ImportButtonId = "importGames";

const actionIds = {
  launch: "launch",
  import: importButtonId,
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

const focus: FocusElement = "main";

export default function Category() {
  const { categoryData, alwaysGameNames } = useLoaderData<typeof loader>();

  const launchButtonRef = useRef<ElementRef<"button">>(null);

  const { isInFocus, switchFocus, switchFocusBack } =
    useFocus<FocusElement>(focus);

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

  const onEntryClick = useCallback(() => {
    if (!isInFocus) {
      switchFocus(focus);
      enableGamepads();
    }
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
                  disabled={!entries || entries.length === 0}
                  value={actionIds.launch}
                  ref={launchButtonRef}
                  icon={
                    gamepadType ? (
                      <GamepadButtonIcon
                        buttonIndex={layout.buttons.A}
                        gamepadType={gamepadType}
                      />
                    ) : (
                      <IoMdPlay />
                    )
                  }
                >
                  Launch Game
                </Button>

                <ImportButton
                  gamepadType={gamepadType}
                  isInFocus={isInFocus}
                  id={actionIds.import}
                >
                  Import Games
                </ImportButton>
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
