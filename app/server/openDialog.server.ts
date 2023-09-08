import { dialog } from "electron";

export const openFolderDialog = (title: string, defaultPath?: string) => {
  const directory = dialog.showOpenDialogSync({
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
    dialog.showErrorBox(title, errorMessage.slice(0, 500));
  }
};
