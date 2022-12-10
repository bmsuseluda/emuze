import { useCallback, useRef } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { IoMdPlay, IoMdRefresh } from "react-icons/io";
import { Button } from "~/components/Button";
import { executeApplication } from "~/server/execute.server";
import { importEntries, readCategory } from "~/server/categories.server";
import type { Category } from "~/types/category";
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
import { useRefsGrid } from "~/hooks/useGamepads/useRefsGrid";

export const loader: LoaderFunction = ({ params }) => {
  const { category } = params;
  if (!category) {
    console.log("category empty");
    throw Error("category empty");
  }

  const categoryData = readCategory(category);
  return json(categoryData);
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
  console.error(error);
  return (
    <>
      <h2>Error!</h2>
      <p>{error.message}</p>
    </>
  );
};

export default function Index() {
  const { id, name, entries } = useLoaderData<Category>();
  const launchButtonRef = useRef<HTMLButtonElement>(null);
  const entriesRefs = useRef<HTMLInputElement[]>([]);
  const { state } = useTransition();
  const { getTestId } = useTestId("category");

  const { entriesRefsGrid } = useRefsGrid(entriesRefs, entries);

  const selectEntry = useCallback((entry: HTMLInputElement) => {
    entry.checked = true;
    entry.focus();
  }, []);

  const { selectedEntry, resetSelected } = useGamepadsOnGrid(
    entriesRefsGrid,
    selectEntry
  );

  const onBack = useCallback(() => {
    if (selectedEntry.current) {
      selectedEntry.current.checked = false;
      resetSelected();
    }
  }, [resetSelected, selectedEntry]);

  const onExecute = useCallback(() => {
    if (selectedEntry.current) {
      launchButtonRef.current?.click();
    }
  }, [selectedEntry]);

  useGamepadButtonPressEvent(layout.buttons.B, onBack);
  useGamepadButtonPressEvent(layout.buttons.A, onExecute);

  useKeyboardEvent("Backspace", onBack);
  useKeyboardEvent("Enter", onExecute);

  return (
    <ListActionBarLayout
      headline={
        <IconChildrenWrapper icon={<PlatformIcon id={id} />}>
          <span>
            <span {...getTestId("name")}>{name}</span>
            {entries && (
              <span {...getTestId(["entries", "length"])}>
                {` (${entries.length})`}
              </span>
            )}
          </span>
        </IconChildrenWrapper>
      }
    >
      <Form method="post">
        <ListActionBarLayout.ListActionBarContainer
          scrollToTopOnLocationChange
          list={
            entries && (
              <EntryList
                entries={entries}
                entriesRefs={entriesRefs}
                onDoubleClick={() => {
                  launchButtonRef.current?.click();
                }}
                {...getTestId("entries")}
              />
            )
          }
          actions={
            <>
              <Button
                type="submit"
                name="_actionId"
                disabled={!entries || entries.length === 0 || state !== "idle"}
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
                disabled={state !== "idle"}
                value={actionIds.import}
                icon={<IoMdRefresh />}
                {...getTestId(["button", "import"])}
              >
                Import Roms
              </Button>
            </>
          }
        />
      </Form>
    </ListActionBarLayout>
  );
}
