/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import filedialog from "node-file-dialog";
import dialog from "dialog-node";

export const openFileDialog = async () => {
  try {
    const config = { type: "directory" };
    const directories: string[] = await filedialog(config);
    const dir = directories[0];

    return dir;
  } catch (error) {
    return undefined;
  }
};

export const openFileDialog2 = () => {
  dialog.fileselect("Select a directory", "folder", 0);
  return "";
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
