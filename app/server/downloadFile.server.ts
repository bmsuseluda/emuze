import { createWriteStream } from "node:fs";
import followRedirects from "follow-redirects";
import { log } from "./debug.server.js";

export const downloadFile = (
  url: string,
  fileToCheck: string,
  onFinish?: () => void,
  onError?: () => void,
) => {
  const file = createWriteStream(fileToCheck);
  console.log(`Download of ${url} started`);

  return followRedirects.https
    .get(url, (response) => {
      if (
        typeof response.statusCode !== "undefined" &&
        response.statusCode !== 200
      ) {
        console.error(
          `Failed to download ${url}. Status code: ${response.statusCode}`,
        );
        onError?.();
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close();

        console.log(`Download of ${url} complete`);
        onFinish?.();
      });
    })
    .on("error", (err) => {
      log("error", `Error downloading the file: ${err.message}`);
      onError?.();
    });
};
