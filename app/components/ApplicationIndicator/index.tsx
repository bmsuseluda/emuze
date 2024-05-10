import type { Application } from "../../types/jsonFiles/applications";
import { Select } from "../Select";

type Props = {
  application: Application;
  installedApplications: Application[];
};

export const ApplicationIndicator = ({
  application,
  installedApplications,
}: Props) => {
  if (installedApplications.length > 1) {
    return (
      <Select.Root name="application" defaultValue={application.id}>
        <Select.Trigger />
        <Select.Content>
          {installedApplications.map(({ id }) => (
            <Select.Item value={id} key={id}>
              {id}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    );
  }

  return null;
};
