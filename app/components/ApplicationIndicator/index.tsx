import type { Application } from "~/types/jsonFiles/applications";
import { Select } from "~/components/Select";
import { styled } from "~/stitches";
import { BiError } from "react-icons/bi";

type Props = {
  application: Application;
  installedApplications: Application[];
};

const ErrorMessage = styled("div", {
  color: "red",
  display: "flex",
  gap: "$1",
  whiteSpace: "nowrap",
  alignItems: "center",

  "& svg": {
    width: "30px",
    height: "30px",
    verticalAlign: "middle",
  },
});

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

  if (installedApplications.length === 0) {
    return (
      <ErrorMessage>
        <BiError />
        No installed emulators
      </ErrorMessage>
    );
  }

  return null;
};
