import { useRef, useState } from "react";
import {
  LoaderFunction,
  useLoaderData,
  json,
  Form,
  ActionFunction,
  useTransition,
} from "remix";
import { Button } from "~/components/button";
import { executeApplication } from "~/server/execute.server";
import { importEntries, readCategory } from "~/server/categories.server";
import { Category } from "~/types/category";
import { EntryList } from "~/components/EntryList";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { useTestId } from "~/hooks/useTestId";

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
  const { name, entries } = useLoaderData<Category>();
  const LaunchButtonRef = useRef<HTMLButtonElement>(null);
  const { state } = useTransition();
  const { getTestId } = useTestId("category");
  const [selected, setSelected] = useState(false);

  return (
    <ListActionBarLayout
      headline={
        <>
          <span {...getTestId("name")}>{name}</span>
          {entries && (
            <span {...getTestId(["entries", "length"])}>
              {` (${entries.length})`}
            </span>
          )}
        </>
      }
    >
      <Form method="post">
        <ListActionBarLayout.ListActionBarContainer
          list={
            entries && (
              <EntryList
                entries={entries}
                onDoubleClick={() => {
                  LaunchButtonRef.current?.click();
                }}
                onSelect={() => {
                  setSelected(true);
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
                  selected === false
                }
                value={actionIds.launch}
                ref={LaunchButtonRef}
                {...getTestId(["button", "launch"])}
              >
                launch
              </Button>
              <Button
                type="submit"
                name="_actionId"
                disabled={state !== "idle"}
                value={actionIds.import}
                {...getTestId(["button", "import"])}
              >
                import
              </Button>
            </>
          }
        />
      </Form>
    </ListActionBarLayout>
  );
}
