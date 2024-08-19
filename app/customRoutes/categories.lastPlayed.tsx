import type { ElementRef } from "react";
import { useCallback, useRef } from "react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, redirect, useLoaderData } from "@remix-run/react";
import { IoMdPlay } from "react-icons/io";
import { Button } from "../components/Button";
import { executeApplication } from "../server/execute.server";
import { GameGridDynamic } from "../components/GameGrid";
import { ListActionBarLayout } from "../components/layouts/ListActionBarLayout";
import { IconChildrenWrapper } from "../components/IconChildrenWrapper";
import { AiFillClockCircle } from "react-icons/ai";
import { layout } from "../hooks/useGamepads/layouts";
import { useFocus } from "../hooks/useFocus";
import type { FocusElement } from "../types/focusElement";
import { readAppearance } from "../server/settings.server";
import { SettingsLink } from "../containers/SettingsLink";
import { Typography } from "../components/Typography";
import { useEnableFocusAfterAction } from "../hooks/useEnableFocusAfterAction";
import { useGamepadConnected } from "../hooks/useGamepadConnected";
import { GamepadButtonIcon } from "../components/GamepadButtonIcon";
import { log } from "../server/debug.server";
import { readLastPlayed } from "../server/lastPlayed.server";

export const loader = () => {
  const lastPlayed = readLastPlayed();
  const { alwaysGameNames } = readAppearance();

  return json({ lastPlayed, alwaysGameNames });
};

const actionIds = {
  launch: "launch",
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const lastPlayed = readLastPlayed();

    const form = await request.formData();
    const _actionId = form.get("_actionId");

    if (_actionId === actionIds.launch) {
      const game = form.get("game");
      if (typeof game === "string") {
        const entryData = lastPlayed.find((value) => value.id === game);

        entryData && executeApplication(entryData.systemId, entryData);
        return null;
      }
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

  const launchButtonRef = useRef<ElementRef<"button">>(null);
  const listRef = useRef<ElementRef<"div">>(null);

  const { isInFocus, switchFocus, switchFocusBack } =
    useFocus<FocusElement>("main");

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

  return (
    <>
      <ListActionBarLayout
        headline={
          <IconChildrenWrapper>
            <AiFillClockCircle />
            <Typography ellipsis>Last Played</Typography>
          </IconChildrenWrapper>
        }
      >
        <Form method="POST">
          <ListActionBarLayout.ListActionBarContainer
            scrollSmooth
            ref={listRef}
            list={
              lastPlayed && (
                <GameGridDynamic
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
                <Button
                  type="submit"
                  name="_actionId"
                  disabled={!lastPlayed || lastPlayed.length === 0}
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
