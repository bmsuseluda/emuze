import { LoaderFunction, Form, ActionFunction, useTransition } from "remix";
import { useLoaderData, json } from "remix";
import { Button } from "~/components/button";
import { FormBox } from "~/components/FormBox";
import { Label } from "~/components/label";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { Select } from "~/components/Select";
import { readAppearance, writeAppearance } from "~/server/settings.server";
import { Appearance, Theme, themes } from "~/types/settings/appearance";

export const loader: LoaderFunction = () => {
  const appearance: Appearance = readAppearance();
  return json(appearance);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const theme = form.get("theme");

  if (typeof theme !== "string") {
    throw new Error(`Form not submitted correctly.`);
  }

  const fields: Appearance = { theme: theme as Theme };
  writeAppearance(fields);
  return null;
};

export default function Index() {
  const { theme } = useLoaderData<Appearance>();
  const { state } = useTransition();

  return (
    <ListActionBarLayout headline="Appearance">
      <Form method="post">
        <ListActionBarLayout.ListActionBarContainer
          list={
            <FormBox>
              <Label>
                Theme
                <Select name="theme" id="theme-select" defaultValue={theme}>
                  {themes.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </Select>
              </Label>
            </FormBox>
          }
          actions={
            <Button type="submit" disabled={state !== "idle"}>
              Save settings
            </Button>
          }
        />
      </Form>
    </ListActionBarLayout>
  );
}
