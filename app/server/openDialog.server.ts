import {
  importElectron,
  setFocusOnElectronWindow,
} from "./importElectron.server.js";

let fileDialogIsOpen = false;
export const isFileDialogOpen = () => fileDialogIsOpen;

export const openFolderDialog = async (title: string, defaultPath?: string) => {
  const electron = importElectron();
  if (electron?.dialog) {
    fileDialogIsOpen = true;
    const directory = electron.dialog.showOpenDialogSync({
      title,
      defaultPath,
      properties: ["openDirectory"],
    });
    fileDialogIsOpen = false;
    setFocusOnElectronWindow();

    return directory ? directory[0] : undefined;
  }

  return undefined;
};
