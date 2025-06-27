import { useCallback } from "react";
import type { ActionFunction } from "react-router";
import { Form, Outlet, redirect, useLoaderData } from "react-router";
import { startGame } from "../server/execute.server.js";
import { importCategories } from "../server/categories.server.js";
import { GameGridDynamic } from "../components/GameGrid/index.js";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout/index.js";
import { IconChildrenWrapper } from "../components/IconChildrenWrapper/index.js";
import { SystemIcon } from "../components/SystemIcon/index.js";
import { useFocus } from "../hooks/useFocus/index.js";
import type { FocusElement } from "../types/focusElement.js";
import { readAppearance, readGeneral } from "../server/settings.server.js";
import { SettingsLink } from "../containers/SettingsLink/index.js";
import { Typography } from "../components/Typography/index.js";
import type { DataFunctionArgs } from "../context.js";
import { useGamepadConnected } from "../hooks/useGamepadConnected/index.js";
import fs from "node:fs";
import nodepath from "node:path";
import type { SystemId } from "../server/categoriesDB.server/systemId.js";
import { log } from "../server/debug.server.js";
import { ImportButton } from "../containers/ImportButton/index.js";
import type { ImportButtonId } from "../containers/ImportButton/importButtonId.js";
import { LaunchButton, launchId } from "../containers/LaunchButton/index.js";
import { readCategory } from "../server/categoryDataCache.server.js";
import { useLaunchButton } from "../hooks/useLaunchButton/index.js";

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
  return { categoryData, alwaysGameNames };
};

const importButtonId: ImportButtonId = "importGames";

const actionIds = {
  launch: launchId,
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

        if (entryData) {
          if (entryData.subEntries?.[0]) {
            return redirect(entryData.id);
          } else {
            await startGame(category as SystemId, entryData);
          }
        }
        return { ok: true };
      }
    }

    if (_actionId === actionIds.import) {
      await importCategories();
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

  const { launchButtonRef, onExecute } = useLaunchButton();

  const { isInFocus, switchFocus, switchFocusBack, enableFocus } =
    useFocus<FocusElement>(focus);

  const { enableGamepads } = useGamepadConnected();

  const onBack = useCallback(() => {
    if (isInFocus) {
      switchFocusBack();
    }
  }, [switchFocusBack, isInFocus]);

  const onEntryClick = useCallback(() => {
    if (!isInFocus) {
      enableFocus();
      enableGamepads();
    }
  }, [isInFocus, enableGamepads, enableFocus]);

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
        paddingLeft="large"
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
                <LaunchButton
                  launchButtonRef={launchButtonRef}
                  disabled={!entries || entries.length === 0}
                />

                <ImportButton isInFocus={isInFocus} id={actionIds.import}>
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
