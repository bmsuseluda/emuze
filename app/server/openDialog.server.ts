/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import dialog from "node-file-dialog";
import nodepath from "path";

export const openFileDialog = async () => {
  const config = { type: "open-file" };
  const directories: string[] = await dialog(config);
  const dir = directories[0];
  const fileName = nodepath.parse(dir).name;
  const app = {
    path: dir,
    id: fileName.toLowerCase(),
    name: fileName,
  };
  return app;
};
