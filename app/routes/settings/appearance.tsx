import { useEffect, useState } from "react";
import {
  LoaderFunction,
  Form,
  ActionFunction,
  useTransition,
  useActionData,
} from "remix";
import { useLoaderData, json } from "remix";
import { Button } from "~/components/button";
import { FileInput } from "~/components/FileInput";
import { FormBox } from "~/components/FormBox";
import { FormRow } from "~/components/FormRow";
import { Label } from "~/components/label";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { openFileDialog } from "~/server/openDialog.server";
import { readAppearance, writeAppearance } from "~/server/settings.server";
import { Appearance } from "~/types/settings/appearance";

export const loader: LoaderFunction = () => {
  const appearance: Appearance = readAppearance() || {};
  return json(appearance);
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

    const fields: Appearance = {
      applicationsPath,
      categoriesPath,
    };
    writeAppearance(fields);
  }

  if (_actionId === actionIds.chooseApplicationsPath) {
    const newApplicationsPath = await openFileDialog();
    if (newApplicationsPath) {
      return json({
        applicationsPath: newApplicationsPath,
        categoriesPath,
      });
    }
  }

  if (_actionId === actionIds.chooseCategoriesPath) {
    const newCategoriesPath = await openFileDialog();
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
  const defaultData = useLoaderData<Appearance>();
  const newData = useActionData<Appearance>();

  const [applicationPath, setApplicationPath] = useState(
    defaultData.applicationsPath
  );

  useEffect(() => {
    if (newData?.applicationsPath) {
      setApplicationPath(newData?.applicationsPath);
    }
  }, [newData?.applicationsPath]);

  const [categoriesPath, setCategoriesPath] = useState(
    defaultData.categoriesPath
  );

  useEffect(() => {
    if (newData?.categoriesPath) {
      setCategoriesPath(newData?.categoriesPath);
    }
  }, [newData?.categoriesPath]);

  const { state } = useTransition();

  return (
    <ListActionBarLayout headline="Appearance">
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
              Save settings
            </Button>
          }
        />
      </Form>
    </ListActionBarLayout>
  );
}
