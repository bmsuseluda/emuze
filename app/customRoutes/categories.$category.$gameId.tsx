import type { ActionFunction } from "react-router";
import {
  Form,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import { readGeneral } from "../server/settings.server.js";
import { useFocus } from "../hooks/useFocus/index.js";
import type { FocusElement } from "../types/focusElement.js";
import { useCallback, useEffect } from "react";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout/index.js";
import { LaunchButton, launchId } from "../containers/LaunchButton/index.js";
import { useGamepadConnected } from "../hooks/useGamepadConnected/index.js";
import type { DataFunctionArgs } from "../context.js";
import { log } from "../server/debug.server.js";
import type { SystemId } from "../server/categoriesDB.server/systemId.js";
import { startGame } from "../server/execute.server.js";
import { SidebarMainLayout } from "../components/layouts/SidebarMainLayout/index.js";
import { readLastPlayed } from "../server/lastPlayed.server.js";
import type { Entry } from "../types/jsonFiles/category.js";
import { useInputSettings } from "../hooks/useDirectionalInput/index.js";
import { GameVersions } from "../components/GameVersions/index.js";
import { GameDialog } from "../components/GameDialog/index.js";
import { readCategory } from "../server/categoryDataCache.server.js";
import { useLaunchButton } from "../hooks/useLaunchButton/index.js";

const getGameData = (category: SystemId, gameId: string) => {
  let systemId: SystemId | undefined;
  let gameData: Entry | undefined;

  if (category === "lastPlayed") {
    const lastPlayed = readLastPlayed();
    const lastPlayedGameData = lastPlayed.find(({ id }) => gameId === id);

    gameData = lastPlayedGameData;
    systemId = lastPlayedGameData?.systemId;
  } else {
    const categoryData = readCategory(category);

    gameData = categoryData?.entries?.find(({ id }) => gameId === id);
    systemId = categoryData?.id;
  }

  return {
    gameData,
    systemId,
  };
};

export const loader = (props: DataFunctionArgs) => {
  const { category, gameId } = props.params;

  if (!category) {
    log("error", "category empty");
    throw Error("category empty");
  }
  if (!gameId) {
    log("error", "gameId empty");
    throw Error("gameId empty");
  }

  const { gameData, systemId } = getGameData(category as SystemId, gameId);

  if (!gameData || !systemId) {
    return redirect("..");
  }

  const pathnameRelative =
    category === "lastPlayed" ? `${category}/${gameId}` : gameId;

  return { systemId, gameData, pathnameRelative };
};

const actionIds = {
  launch: launchId,
};

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const { category, gameId } = params;
    if (!category) {
      log("error", "category empty");
      throw Error("category empty");
    }
    if (!gameId) {
      log("error", "gameId empty");
      throw Error("gameId empty");
    }

    const general = readGeneral();
    const { gameData, systemId } = getGameData(category as SystemId, gameId);

    if (!general?.categoriesPath || !systemId) {
      return redirect("/settings");
    }

    const form = await request.formData();
    const _actionId = form.get("_actionId");
    if (_actionId === actionIds.launch) {
      const game = form.get("gameVersion");
      if (typeof game === "string") {
        const subEntryData = gameData?.subEntries?.find(
          (value) => value.id === game,
        );

        if (subEntryData) {
          await startGame(systemId, subEntryData, gameData);
        }

        return { ok: true };
      }
    }
  } catch (e) {
    log("error", "gameId action", e);
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

const focus: FocusElement = "gameDialog";

export default function Index() {
  const { gameData, pathnameRelative } = useLoaderData<typeof loader>();

  const { launchButtonRef, onExecute } = useLaunchButton();

  const { isInFocus, enableFocus, switchFocusBack } =
    useFocus<FocusElement>(focus);

  const { enableGamepads } = useGamepadConnected();

  useEffect(() => {
    if (!isInFocus) {
      enableGamepads();
      enableFocus();
    }
    // Should be executed only once, therefore isInFocus can not be part of the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    switchFocusBack();
    navigate(pathname.split(`/${pathnameRelative}`)[0]);
  }, [pathname, navigate, switchFocusBack, pathnameRelative]);

  const onEntryClick = useCallback(() => {
    if (!isInFocus) {
      enableFocus();
      enableGamepads();
    }
  }, [isInFocus, enableGamepads, enableFocus]);

  const onBack = useCallback(() => {
    if (isInFocus) {
      handleClose();
    }
  }, [handleClose, isInFocus]);

  useInputSettings(onBack);

  const { id, subEntries } = gameData;

  return (
    <GameDialog onClose={handleClose}>
      <SidebarMainLayout>
        <SidebarMainLayout.Main dynamicWidth>
          <ListActionBarLayout>
            <Form method="POST" aria-label="gameVersions">
              <ListActionBarLayout.ListActionBarContainer
                scrollSmooth
                dynamicHeight
                paddingSide={false}
                list={
                  subEntries && (
                    <GameVersions
                      key={id + subEntries.length}
                      gameVersions={subEntries}
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
                      disabled={!subEntries || subEntries.length === 0}
                    />
                  </>
                }
              />
            </Form>
          </ListActionBarLayout>
        </SidebarMainLayout.Main>
      </SidebarMainLayout>
      <Outlet />
    </GameDialog>
  );
}
