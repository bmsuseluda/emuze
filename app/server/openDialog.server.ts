/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import filedialog from "node-file-dialog";
import dialog from "dialog-node";
import nodepath from "path";

export const openFileDialog = async () => {
  const config = { type: "open-file" };
  const directories: string[] = await filedialog(config);
  const dir = directories[0];
  const fileName = nodepath.parse(dir).name;
  const app = {
    path: dir,
    id: fileName.toLowerCase(),
    name: fileName,
  };
  return app;
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
