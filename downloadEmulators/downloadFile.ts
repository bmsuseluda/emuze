import { createWriteStream, existsSync } from "node:fs";
import followRedirects from "follow-redirects";
import decompress from "decompress";
// @ts-ignore
import decompressTarxz from "@felipecrs/decompress-tarxz";
// @ts-ignore
import decompressUnzip from "decompress-unzip";
import { log } from "../app/server/debug.server.js";

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

export const downloadAndExtract = (
  url: string,
  outputFolder: string,
  fileToCheck: string,
  onFinish?: () => void,
  onError?: () => void,
) => {
  console.log(`Download of ${url} started`);
  followRedirects.https
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

      const chunks: Buffer[] = [];

      response.on("data", (chunk) => {
        chunks.push(chunk);
      });

      response.on("end", async () => {
        const buffer = Buffer.concat(chunks);
        try {
          await decompress(buffer, outputFolder, {
            filter: (file) => !file.path.endsWith("/"),
            plugins: [decompressTarxz(), decompressUnzip()],
          });
          console.log(`Download of ${url} complete`);
          console.log(`${url} extracted`);

          onFinish?.();

          if (!existsSync(fileToCheck)) {
            console.error(`${fileToCheck} does not exist`);
            process.exit(1);
          }
        } catch (err) {
          console.error(`Error during extraction: ${err}`);
          process.exit(1);
        }
      });
    })
    .on("error", (err) => {
      console.error(`Error downloading the file: ${err.message}`);
      process.exit(1);
    });
};
