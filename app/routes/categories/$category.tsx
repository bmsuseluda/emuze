import type { ElementRef } from "react";
import { useCallback, useEffect, useRef } from "react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import { IoMdPlay, IoMdRefresh } from "react-icons/io";
import { Button } from "~/components/Button";
import { executeApplication } from "~/server/execute.server";
import { importEntries, readCategory } from "~/server/categories.server";
import { EntryListDynamic } from "~/components/EntryList";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { useTestId } from "~/hooks/useTestId";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { PlatformIcon } from "~/components/PlatformIcon";
import { layout } from "~/hooks/useGamepads/layouts";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElement } from "~/types/focusElement";
import { readAppearance } from "~/server/settings.server";
import type { DataFunctionArgs } from "~/context";
import { useFullscreen } from "~/hooks/useFullscreen";
import { SettingsLink } from "~/components/SettingsLink";
import { BiError } from "react-icons/bi";
import { Typography } from "~/components/Typography";

export const loader = ({ params }: DataFunctionArgs) => {
  const { category } = params;
  if (!category) {
    console.log("category empty");
    throw Error("category empty");
  }

  // TODO: check what todo if categoryData is null
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
  const { categoryData, alwaysGameNames } = useLoaderData<typeof loader>();

  const isFullscreen = useFullscreen();
  const launchButtonRef = useRef<ElementRef<"button">>(null);
  const importButtonRef = useRef<ElementRef<"button">>(null);
  const settingsButtonRef = useRef<ElementRef<"a">>(null);

  const { getTestId } = useTestId("category");
  const { isInFocus, disableFocus, switchFocus } =
    useFocus<FocusElement>("main");

  const { state, formData } = useNavigation();
  useEffect(() => {
    if (
      state === "loading" &&
      formData?.get("_actionId") === actionIds.launch
    ) {
      switchFocus("main");
    }
  }, [state, formData, switchFocus]);

  const onBack = useCallback(() => {
    switchFocus("sidebar");
  }, [switchFocus]);

  const onExecute = useCallback(() => {
    disableFocus();
    launchButtonRef.current?.click();
  }, [disableFocus]);

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
            <PlatformIcon id={id} />
            <Typography {...getTestId("name")}>{name}</Typography>
          </IconChildrenWrapper>
        }
      >
        <Form method="post">
          <ListActionBarLayout.ListActionBarContainer
            scrollSmooth
            list={
              entries && (
                <EntryListDynamic
                  key={id}
                  entries={entries}
                  alwaysGameNames={alwaysGameNames}
                  onExecute={onExecute}
                  onBack={onBack}
                  isInFocus={isInFocus}
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
                  icon={!application ? <BiError /> : <IoMdPlay />}
                >
                  {!application ? "No installed emulators" : "Launch Game"}
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
                  icon={<IoMdRefresh />}
                >
                  Import Games
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
