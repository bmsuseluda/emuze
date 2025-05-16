import { electron } from "./importElectron.server";

export const openFolderDialog = (title: string, defaultPath?: string) => {
  const { dialog } = electron;
  if (dialog) {
    const directory = dialog.showOpenDialogSync({
      title,
      defaultPath,
      properties: ["openDirectory"],
    });

    return directory ? directory[0] : undefined;
  }

  return undefined;
};
