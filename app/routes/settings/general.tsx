import { useEffect, useState } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { IoMdSave } from "react-icons/io";
import { IoFolderOpenSharp } from "react-icons/io5";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { Button } from "~/components/Button";
import { FileInput } from "~/components/FileInput";
import { FormBox } from "~/components/FormBox";
import { FormRow } from "~/components/FormRow";
import { Label } from "~/components/Label";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { importApplications } from "~/server/applications.server";
import { importCategories } from "~/server/categories.server";
import { openFolderDialog } from "~/server/openDialog.server";
import { readGeneral, writeGeneral } from "~/server/settings.server";
import type { General } from "~/types/settings/general";
import { isWindows } from "~/server/operationsystem.server";
import { Checkbox } from "~/components/Checkbox";
import { useFullscreen } from "~/hooks/useFullscreen";
import { DataFunctionArgs } from "@remix-run/server-runtime/dist/routeModules";

export const loader = ({ context }: DataFunctionArgs) => {
  const general: General = readGeneral() || {};
  return json({ ...general, isWindows, fullscreen: context?.fullscreen });
};

const actionIds = {
  chooseApplicationsPath: "chooseApplicationsPath",
  chooseCategoriesPath: "chooseCategoriesPath",
  save: "save",
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const _actionId = form.get("_actionId");
  const applicationsPath = form.get("applicationsPath");
  const categoriesPath = form.get("categoriesPath");
  const fullscreen = form.get("fullscreen") === "on";

  if (_actionId === actionIds.save) {
    if (
      (isWindows && typeof applicationsPath !== "string") ||
      typeof categoriesPath !== "string"
    ) {
      throw new Error(`Form not submitted correctly.`);
    }

    const fields: General = {
      applicationsPath:
        isWindows && typeof applicationsPath === "string"
          ? applicationsPath
          : null,
      categoriesPath,
      fullscreen,
    };
    writeGeneral(fields);
    importApplications();
    await importCategories();
    return redirect("/categories");
  }

  if (_actionId === actionIds.chooseApplicationsPath) {
    const newApplicationsPath = openFolderDialog(
      "Select Emulators Folder",
      typeof applicationsPath === "string" ? applicationsPath : undefined
    );
    if (newApplicationsPath) {
      return json({
        applicationsPath: newApplicationsPath,
        categoriesPath,
      });
    }
  }

  if (_actionId === actionIds.chooseCategoriesPath) {
    const newCategoriesPath = openFolderDialog(
      "Select Roms Folder",
      typeof categoriesPath === "string" ? categoriesPath : undefined
    );
    if (newCategoriesPath) {
      return json({
        applicationsPath,
        categoriesPath: newCategoriesPath,
      });
    }
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
  const defaultData = useLoaderData<typeof loader>();
  const newData = useActionData<General>();
  const fullscreen = useFullscreen(defaultData.fullscreen || false);

  const [applicationPath, setApplicationPath] = useState(
    defaultData.applicationsPath || ""
  );

  useEffect(() => {
    if (newData?.applicationsPath) {
      setApplicationPath(newData?.applicationsPath);
    }
  }, [newData?.applicationsPath]);

  const [categoriesPath, setCategoriesPath] = useState(
    defaultData.categoriesPath || ""
  );

  useEffect(() => {
    if (newData?.categoriesPath) {
      setCategoriesPath(newData?.categoriesPath);
    }
  }, [newData?.categoriesPath]);

  const { state } = useTransition();

  return (
    <ListActionBarLayout headline="General">
      <Form method="post">
        <ListActionBarLayout.ListActionBarContainer
          list={
            <FormBox>
              {defaultData.isWindows && (
                <FormRow>
                  <Label htmlFor="applicationsPath">Emulators Path</Label>
                  <FileInput>
                    <FileInput.TextInput
                      name="applicationsPath"
                      id="applicationsPath"
                      value={applicationPath}
                      onChange={(event) =>
                        setApplicationPath(event.target.value)
                      }
                    />
                    <FileInput.Button
                      type="submit"
                      name="_actionId"
                      value={actionIds.chooseApplicationsPath}
                      disabled={state !== "idle"}
                      icon={<IoFolderOpenSharp />}
                    >
                      Choose
                    </FileInput.Button>
                  </FileInput>
                </FormRow>
              )}

              <FormRow>
                <Label htmlFor="categoriesPath">Roms Path</Label>
                <FileInput>
                  <FileInput.TextInput
                    name="categoriesPath"
                    id="categoriesPath"
                    value={categoriesPath}
                    onChange={(event) => setCategoriesPath(event.target.value)}
                  />
                  <FileInput.Button
                    type="submit"
                    name="_actionId"
                    value={actionIds.chooseCategoriesPath}
                    disabled={state !== "idle"}
                    icon={<IoFolderOpenSharp />}
                  >
                    Choose
                  </FileInput.Button>
                </FileInput>
              </FormRow>
              <FormRow>
                <Label htmlFor="fullscreen">Fullscreen</Label>
                <Checkbox
                  id="fullscreen"
                  name="fullscreen"
                  checked={fullscreen}
                  onClick={() => electronAPI.changeWindow("fullscreen")}
                />
              </FormRow>
            </FormBox>
          }
          actions={
            <Button
              type="submit"
              name="_actionId"
              value={actionIds.save}
              disabled={state !== "idle"}
              icon={<IoMdSave />}
            >
              Save settings and import all
            </Button>
          }
        />
      </Form>
    </ListActionBarLayout>
  );
}
