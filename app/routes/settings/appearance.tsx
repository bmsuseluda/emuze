import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { IoMdSave } from "react-icons/io";
import { Form } from "@remix-run/react";
import { Button } from "~/components/Button";
import { FormBox } from "~/components/FormBox";
import { FormRow } from "~/components/FormRow";
import { Label } from "~/components/Label";
import { ListActionBarLayout } from "~/components/layouts/ListActionBarLayout";
import { readAppearance, writeAppearance } from "~/server/settings.server";
import { Checkbox } from "~/components/Checkbox";
import type { Appearance } from "~/types/settings/appearance";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { SettingsIcon } from "~/components/SettingsIcon";
import { useFullscreen } from "~/hooks/useFullscreen";

export const loader = () => {
  const appearance: Appearance = readAppearance() || {};
  return json(appearance);
};

const actionIds = {
  save: "save",
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const _actionId = form.get("_actionId");
  const fullscreen = form.get("fullscreen") === "on";

  if (_actionId === actionIds.save) {
    const fields: Appearance = {
      fullscreen,
    };
    writeAppearance(fields);
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
  const fullscreen = useFullscreen();

  return (
    <ListActionBarLayout
      headline={
        <IconChildrenWrapper icon={<SettingsIcon id="appearance" />}>
          <span>
            <span>Appearance</span>
          </span>
        </IconChildrenWrapper>
      }
    >
      <Form method="post">
        <ListActionBarLayout.ListActionBarContainer
          scrollToTopOnLocationChange
          list={
            <FormBox>
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
              icon={<IoMdSave />}
            >
              Save settings
            </Button>
          }
        />
      </Form>
    </ListActionBarLayout>
  );
}
