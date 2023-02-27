import { useCallback, useEffect, useRef, useState } from "react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import { IoMdPlay, IoMdRefresh } from "react-icons/io";
import { Button } from "~/components/Button";
import { executeApplication } from "~/server/execute.server";
import { importEntries, readCategory } from "~/server/categories.server";
import { EntryList } from "~/components/EntryList";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { useTestId } from "~/hooks/useTestId";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { PlatformIcon } from "~/components/PlatformIcon";
import { layout } from "~/hooks/useGamepads/layouts";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { useGamepadsOnGrid } from "~/hooks/useGamepadsOnGrid";
import { useRefsGrid } from "~/hooks/useRefsGrid";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElement } from "~/types/focusElement";
import { readAppearance } from "~/server/settings.server";
import type { DataFunctionArgs } from "@remix-run/server-runtime/dist/routeModules";
import { useFullscreen } from "~/hooks/useFullscreen";
import { SettingsLink } from "~/components/SettingsLink";

export const loader = ({ params }: DataFunctionArgs) => {
  const { category } = params;
  if (!category) {
    console.log("category empty");
    throw Error("category empty");
  }

  const categoryData = readCategory(category);
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

  const form = await request.formData();
  const _actionId = form.get("_actionId");

  if (_actionId === actionIds.launch) {
    const entry = form.get("entry");
    if (typeof entry === "string") {
      executeApplication(category, entry);
      // TODO: Find a better solution to trigger switchFocusToMain when launch game is finished
      return json({ actionId: `${_actionId}${Date.now()}` });
    }
  }

  if (_actionId === actionIds.import) {
    await importEntries(category);
  }

  return null;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  // TODO: Replace with something good
  console.error(error);
  return (
    <>
      <h2>Error!</h2>
      <p>{error.message}</p>
    </>
  );
};

export default function Category() {
  const {
    categoryData: { id, name, entries },
    alwaysGameNames,
  } = useLoaderData<typeof loader>();

  const isFullscreen = useFullscreen();
  const actionData = useActionData<{ actionId?: string }>();
  const launchButtonRef = useRef<HTMLButtonElement>(null);
  const importButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLAnchorElement>(null);
  const entryListRef = useRef<HTMLUListElement>(null);
  const entriesRefs = useRef<HTMLInputElement[]>([]);
  const { getTestId } = useTestId("category");
  const { isInFocus, disableFocus, switchFocus } =
    useFocus<FocusElement>("main");

  useEffect(() => {
    // TODO: This interferes with mouse usage, but shouldn't
    if (actionData?.actionId?.startsWith(actionIds.launch)) {
      switchFocus("main");
    }
  }, [actionData?.actionId, switchFocus]);

  const { entriesRefsGrid } = useRefsGrid(entryListRef, entriesRefs, entries);

  const selectEntry = useCallback((entry: HTMLInputElement) => {
    entry.checked = true;
    entry.focus();
  }, []);

  const { selectedEntry, resetSelected } = useGamepadsOnGrid(
    entriesRefsGrid,
    selectEntry,
    isInFocus
  );

  const onBack = useCallback(() => {
    if (isInFocus) {
      if (selectedEntry.current) {
        selectedEntry.current.checked = false;
        resetSelected();
      }
      switchFocus("sidebar");
    }
  }, [isInFocus, resetSelected, selectedEntry, switchFocus]);

  const onExecute = useCallback(() => {
    if (isInFocus) {
      if (selectedEntry.current) {
        disableFocus();
        launchButtonRef.current?.click();
      }
    }
  }, [isInFocus, selectedEntry, disableFocus]);

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

  useGamepadButtonPressEvent(layout.buttons.B, onBack);
  useGamepadButtonPressEvent(layout.buttons.A, onExecute);
  useGamepadButtonPressEvent(layout.buttons.X, onImport);
  useGamepadButtonPressEvent(layout.buttons.Start, onSettings);

  useKeyboardEvent("Backspace", onBack);
  useKeyboardEvent("Enter", onExecute);
  useKeyboardEvent("i", onImport);
  useKeyboardEvent("Escape", onSettings);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [entries]);

  return (
    <>
      <ListActionBarLayout
        headline={
          <IconChildrenWrapper icon={<PlatformIcon id={id} />}>
            <span>
              <span {...getTestId("name")}>{name}</span>
            </span>
          </IconChildrenWrapper>
        }
      >
        <Form method="post">
          <ListActionBarLayout.ListActionBarContainer
            scrollToTopOnLocationChange
            pathId={id}
            scrollSmooth
            list={
              entries && (
                <EntryList
                  entries={entries}
                  alwaysGameNames={alwaysGameNames}
                  entriesRefs={entriesRefs}
                  onDoubleClick={() => {
                    launchButtonRef.current?.click();
                  }}
                  ref={entryListRef}
                  {...getTestId("entries")}
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
                  icon={<IoMdPlay />}
                  {...getTestId(["button", "launch"])}
                >
                  Launch Rom
                </Button>
                <Button
                  type="submit"
                  name="_actionId"
                  value={actionIds.import}
                  ref={importButtonRef}
                  icon={<IoMdRefresh />}
                  loading={loading}
                  onClick={() => {
                    setLoading(true);
                  }}
                  {...getTestId(["button", "import"])}
                >
                  Import Roms
                </Button>
              </>
            }
          />
        </Form>
      </ListActionBarLayout>
      <SettingsLink isFullscreen={isFullscreen} ref={settingsButtonRef} />
      <Outlet />
    </>
  );
}
