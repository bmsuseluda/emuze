import { useEffect, useState } from "react";
import {
  LoaderFunction,
  Form,
  ActionFunction,
  useTransition,
  useActionData,
  redirect,
} from "remix";
import { useLoaderData, json } from "remix";
import { Button } from "~/components/button";
import { FileInput } from "~/components/FileInput";
import { FormBox } from "~/components/FormBox";
import { FormRow } from "~/components/FormRow";
import { Label } from "~/components/label";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { importApplications } from "~/server/applications.server";
import { importCategories } from "~/server/categories.server";
import { openFolderDialog } from "~/server/openDialog.server";
import { readGeneral, writeGeneral } from "~/server/settings.server";
import { General } from "~/types/settings/general";

export const loader: LoaderFunction = () => {
  const general: General = readGeneral() || {};
  return json(general);
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

  if (_actionId === actionIds.save) {
    if (
      typeof applicationsPath !== "string" ||
      typeof categoriesPath !== "string"
    ) {
      throw new Error(`Form not submitted correctly.`);
    }

    const fields: General = {
      applicationsPath,
      categoriesPath,
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

export default function Index() {
  const defaultData = useLoaderData<General>();
  const newData = useActionData<General>();

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
              <FormRow>
                <Label htmlFor="applicationsPath">Applications Path</Label>
                <FileInput>
                  <FileInput.TextInput
                    name="applicationsPath"
                    id="applicationsPath"
                    value={applicationPath}
                    onChange={(event) => setApplicationPath(event.target.value)}
                  />
                  <FileInput.Button
                    type="submit"
                    name="_actionId"
                    value={actionIds.chooseApplicationsPath}
                    disabled={state !== "idle"}
                  >
                    choose
                  </FileInput.Button>
                </FileInput>
              </FormRow>

              <FormRow>
                <Label htmlFor="categoriesPath">Categories Path</Label>
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
                  >
                    choose
                  </FileInput.Button>
                </FileInput>
              </FormRow>
            </FormBox>
          }
          actions={
            <Button
              type="submit"
              name="_actionId"
              value={actionIds.save}
              disabled={state !== "idle"}
            >
              Save settings and import
            </Button>
          }
        />
      </Form>
    </ListActionBarLayout>
  );
}
