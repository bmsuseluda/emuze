import { dialog } from "electron";

export const openFolderDialog = (title: string, defaultPath?: string) => {
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
