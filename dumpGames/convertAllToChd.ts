import { readFilenames } from "../app/server/readWriteData.server.js";
import { convertToChd } from "./convertToChd.js";

const convertAllToChd = (path: string) => {
  const files = readFilenames({ path, fileExtensions: [".cue", ".iso"] });

  files.forEach((filename) => {
    convertToChd(filename);
  });
};

convertAllToChd("./new roms");
