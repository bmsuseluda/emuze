import { useCallback, useEffect, useRef } from "react";
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
import layout from "~/hooks/useGamepads/layouts/xbox";
import { useGamepadEvent } from "~/hooks/useGamepadEvent";

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
  const entriesRefs = useRef<(HTMLInputElement | null)[]>([]);
  const entriesRefsGrid = useRef<(HTMLInputElement | null)[][]>([]);
  const { state } = useTransition();
  const { getTestId } = useTestId("category");

  const selectedX = useRef<number>();
  const selectedY = useRef<number>();

  useEffect(() => {
    selectedX.current = undefined;
    selectedY.current = undefined;
  }, [id]);

  const choseEntry = useCallback((x: number, y: number) => {
    const entry = entriesRefsGrid.current[y][x];
    if (entry) {
      entry.checked = true;
      entry.focus();
    }
  }, []);

  const getLastIndex = useCallback((array: any[]) => array.length - 1, []);

  const createRefsGrid = () => {
    const entriesGrid: (HTMLInputElement | null)[][] = [];

    const addToRow = (rowIndex: number, entry: HTMLInputElement | null) => {
      if (!entriesGrid[rowIndex]) {
        // create new row
        entriesGrid[rowIndex] = [entry];
      } else {
        // add to existing row
        entriesGrid[rowIndex].push(entry);
      }
    };

    let rowIndex = 0;
    entriesRefs.current.forEach((entry, index) => {
      const top = entry?.getBoundingClientRect().top;
      if (index > 0) {
        const topPrevious =
          entriesRefs.current[index - 1]?.getBoundingClientRect().top;
        if (top && topPrevious && top > topPrevious) {
          // nextRow
          rowIndex = rowIndex + 1;
          addToRow(rowIndex, entry);
          return;
        }
      }
      addToRow(rowIndex, entry);
    });
    entriesRefsGrid.current = entriesGrid;
  };

  useEffect(() => {
    createRefsGrid();
  }, [entries]);

  useEffect(() => {
    window.addEventListener("resize", createRefsGrid);

    return () => {
      window.removeEventListener("resize", createRefsGrid);
    };
  });

  useGamepadEvent(
    layout.buttons.DPadRight,
    useCallback(() => {
      if (entriesRefsGrid.current) {
        if (
          typeof selectedX.current !== "undefined" &&
          typeof selectedY.current !== "undefined"
        ) {
          if (
            selectedX.current <
            getLastIndex(entriesRefsGrid.current[selectedY.current])
          ) {
            selectedX.current = selectedX.current + 1;
            choseEntry(selectedX.current, selectedY.current);
          } else if (
            selectedX.current ===
            getLastIndex(entriesRefsGrid.current[selectedY.current])
          ) {
            selectedX.current = 0;
            choseEntry(selectedX.current, selectedY.current);
          }
        } else {
          selectedX.current = 0;
          selectedY.current = 0;
          choseEntry(selectedX.current, selectedY.current);
        }
      }
    }, [choseEntry])
  );

  useGamepadEvent(
    layout.buttons.DPadLeft,
    useCallback(() => {
      if (entriesRefsGrid.current) {
        if (
          typeof selectedX.current !== "undefined" &&
          typeof selectedY.current !== "undefined"
        ) {
          if (selectedX.current > 0) {
            selectedX.current = selectedX.current - 1;
            choseEntry(selectedX.current, selectedY.current);
          } else if (selectedX.current === 0) {
            selectedX.current = getLastIndex(
              entriesRefsGrid.current[selectedY.current]
            );
            choseEntry(selectedX.current, selectedY.current);
          }
        }
      }
    }, [choseEntry])
  );

  useGamepadEvent(
    layout.buttons.DPadDown,
    useCallback(() => {
      if (entriesRefsGrid.current) {
        if (
          typeof selectedX.current !== "undefined" &&
          typeof selectedY.current !== "undefined"
        ) {
          if (selectedY.current < getLastIndex(entriesRefsGrid.current)) {
            selectedY.current = selectedY.current + 1;
            if (
              !entriesRefsGrid.current[selectedY.current][selectedX.current]
            ) {
              selectedX.current = getLastIndex(
                entriesRefsGrid.current[selectedY.current]
              );
            }
            choseEntry(selectedX.current, selectedY.current);
          } else if (
            selectedY.current === getLastIndex(entriesRefsGrid.current)
          ) {
            selectedY.current = 0;
            choseEntry(selectedX.current, selectedY.current);
          }
        }
      }
    }, [choseEntry])
  );

  useGamepadEvent(
    layout.buttons.DPadUp,
    useCallback(() => {
      if (entriesRefsGrid.current) {
        if (
          typeof selectedX.current !== "undefined" &&
          typeof selectedY.current !== "undefined"
        ) {
          if (selectedY.current > 0) {
            selectedY.current = selectedY.current - 1;
            choseEntry(selectedX.current, selectedY.current);
          } else if (selectedY.current === 0) {
            selectedY.current = getLastIndex(entriesRefsGrid.current);
            if (
              !entriesRefsGrid.current[selectedY.current][selectedX.current]
            ) {
              selectedX.current = getLastIndex(
                entriesRefsGrid.current[selectedY.current]
              );
            }
            choseEntry(selectedX.current, selectedY.current);
          }
        }
      }
    }, [choseEntry])
  );

  useGamepadEvent(
    layout.buttons.B,
    useCallback(() => {
      if (entriesRefsGrid.current) {
        if (
          typeof selectedX.current !== "undefined" &&
          typeof selectedY.current !== "undefined"
        ) {
          const entry =
            entriesRefsGrid.current[selectedY.current][selectedX.current];
          if (entry) {
            entry.checked = false;
            selectedX.current = undefined;
            selectedY.current = undefined;
          }
        }
      }
    }, [])
  );

  useGamepadEvent(
    layout.buttons.A,
    useCallback(() => {
      if (entriesRefsGrid.current) {
        if (
          typeof selectedX.current !== "undefined" &&
          typeof selectedY.current !== "undefined"
        ) {
          launchButtonRef.current?.click();
        } else {
          selectedX.current = 0;
          selectedY.current = 0;
          choseEntry(selectedX.current, selectedY.current);
        }
      }
    }, [choseEntry])
  );

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
