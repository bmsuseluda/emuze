import { importElectron } from "./importElectron.server.js";

export const openFolderDialog = async (title: string, defaultPath?: string) => {
  const electron = importElectron();
  if (electron?.dialog) {
    const directory = electron.dialog.showOpenDialogSync({
      title,
      defaultPath,
      properties: ["openDirectory"],
    });

    return directory ? directory[0] : undefined;
  }

  return undefined;
};
