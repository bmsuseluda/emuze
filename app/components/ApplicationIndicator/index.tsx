import type { Application } from "~/types/jsonFiles/applications";

type Props = {
  application: Application;
  installedApplications: Application[];
};

/**
 * application installed -> show name
 * application not installed -> no application is installed
 * if there are multiple applications installed -> show switcher
 */
export const ApplicationIndicator = ({ application }: Props) => (
  <div>{application.id}</div>
);
