import dialog from "dialog-node";
import { dialog as electronDialog } from "electron";

export const openFolderDialog = (title: string, defaultPath?: string) => {
  const directory = electronDialog.showOpenDialogSync({
    title,
    defaultPath,
    properties: ["openDirectory"],
  });

  return directory ? directory[0] : undefined;
};

export const openErrorDialog = (error: unknown, title: string) => {
  let errorMessage;
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.log("unknown error type");
  }

  if (errorMessage) {
    dialog.error(errorMessage, title, 0);
  }
};
