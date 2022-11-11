import { useEffect, useRef, useState } from "react";
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
import { useGamepads } from "~/hooks/useGamepads";
import layout from "~/hooks/useGamepads/layouts/xbox";

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
  const { state } = useTransition();
  const { getTestId } = useTestId("category");
  const [selected, setSelected] = useState<number>();

  useEffect(() => {
    setSelected(undefined);
  }, [entries]);

  const choseEntry = (index: number) => {
    const entry = entriesRefs.current[index];
    if (entry) {
      entry.checked = true;
      entry.focus();
      setSelected(index);
    }
  };

  useGamepads([
    {
      gamepadIndex: 0,
      onButtonPress: (buttonId) => {
        if (entries) {
          if (layout.buttons.DPadRight === buttonId) {
            if (typeof selected === "undefined") {
              choseEntry(0);
            } else if (selected < entries.length - 1) {
              choseEntry(selected + 1);
            } else if (selected === entries.length - 1) {
              choseEntry(0);
            }
          }

          if (layout.buttons.DPadLeft === buttonId) {
            if (typeof selected !== "undefined") {
              if (selected > 0) {
                choseEntry(selected - 1);
              } else if (selected === 0) {
                choseEntry(entries.length - 1);
              }
            }
          }

          if (
            layout.buttons.B === buttonId &&
            typeof selected !== "undefined"
          ) {
            const entry = entriesRefs.current[selected];
            if (entry) {
              entry.checked = false;
              setSelected(undefined);
            }
          }

          if (layout.buttons.A === buttonId) {
            if (typeof selected !== "undefined") {
              launchButtonRef.current?.click();
            } else {
              choseEntry(0);
            }
          }
        }
      },
    },
  ]);

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
                onSelect={(index: number) => {
                  setSelected(index);
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
                disabled={
                  !entries ||
                  entries.length === 0 ||
                  state !== "idle" ||
                  typeof selected === "undefined"
                }
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
