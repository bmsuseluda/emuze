import type { ComponentRef } from "react";
import { useCallback, useRef } from "react";
import type { ActionFunction } from "react-router";
import { Form, Outlet, redirect, useLoaderData } from "react-router";
import { startGame } from "../server/execute.server.js";
import { GameGridDynamic } from "../components/GameGrid/index.js";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout/index.js";
import { IconChildrenWrapper } from "../components/IconChildrenWrapper/index.js";
import { useFocus } from "../hooks/useFocus/index.js";
import type { FocusElement } from "../types/focusElement.js";
import { readAppearance, readGeneral } from "../server/settings.server.js";
import { SettingsLink } from "../containers/SettingsLink/index.js";
import { Typography } from "../components/Typography/index.js";
import { useEnableFocusAfterAction } from "../hooks/useEnableFocusAfterAction/index.js";
import { useGamepadConnected } from "../hooks/useGamepadConnected/index.js";
import { log } from "../server/debug.server.js";
import { readLastPlayed } from "../server/lastPlayed.server.js";
import { SystemIcon } from "../components/SystemIcon/index.js";
import fs from "node:fs";
import { LaunchButton } from "../containers/LaunchButton/index.js";
import { ImportButton } from "../containers/ImportButton/index.js";
import type { ImportButtonId } from "../containers/ImportButton/importButtonId.js";
import { importCategories } from "../server/categories.server.js";

export const loader = () => {
  const lastPlayed = readLastPlayed();
  const { alwaysGameNames } = readAppearance();

  return { lastPlayed, alwaysGameNames };
};

const importButtonId: ImportButtonId = "importGames";

const actionIds = {
  launch: "launch",
  import: importButtonId,
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const lastPlayed = readLastPlayed();

    const form = await request.formData();
    const _actionId = form.get("_actionId");

    const general = readGeneral();

    if (!general?.categoriesPath || !fs.existsSync(general.categoriesPath)) {
      return redirect("settings");
    }

    if (_actionId === actionIds.launch) {
      const game = form.get("game");
      if (typeof game === "string") {
        const entryData = lastPlayed.find((value) => value.id === game);

        if (entryData) {
          if (entryData.subEntries?.[0]) {
            return redirect(`lastPlayed/${entryData.id}`);
          } else {
            await startGame(entryData.systemId, entryData);
          }
        }

        return null;
      }
    }

    if (_actionId === actionIds.import) {
      await importCategories();
    }
  } catch (e) {
    log("error", "lastPlayed action", e);
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

export default function LastPlayed() {
  const { lastPlayed, alwaysGameNames } = useLoaderData<typeof loader>();

  const launchButtonRef = useRef<ComponentRef<"button">>(null);

  const { isInFocus, switchFocus, switchFocusBack, enableFocus } =
    useFocus<FocusElement>("main");

  const { gamepadType, enableGamepads, disableGamepads } =
    useGamepadConnected();

  /* Set focus again after launching */
  useEnableFocusAfterAction(() => enableGamepads(true), [actionIds.launch]);

  const onBack = useCallback(() => {
    if (isInFocus) {
      switchFocusBack();
    }
  }, [switchFocusBack, isInFocus]);

  const onExecute = useCallback(() => {
    if (launchButtonRef.current && !launchButtonRef.current.disabled) {
      disableGamepads(true);
      launchButtonRef.current.click();
    }
  }, [disableGamepads]);

  const onEntryClick = useCallback(() => {
    if (!isInFocus) {
      enableFocus();
      enableGamepads();
    }
  }, [isInFocus, enableGamepads, enableFocus]);

  return (
    <>
      <ListActionBarLayout
        headline={
          <IconChildrenWrapper>
            <SystemIcon id="lastPlayed" />
            <Typography ellipsis>Last Played</Typography>
          </IconChildrenWrapper>
        }
      >
        <Form method="POST">
          <ListActionBarLayout.ListActionBarContainer
            scrollSmooth
            list={
              lastPlayed && (
                <GameGridDynamic
                  key={`${lastPlayed[0]?.systemId}${lastPlayed[0]?.name}`}
                  games={lastPlayed}
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
                  gamepadType={gamepadType}
                  launchButtonRef={launchButtonRef}
                  disabled={!lastPlayed || lastPlayed.length === 0}
                />

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
