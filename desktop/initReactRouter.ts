import { join } from "node:path";
import electron, { app, protocol } from "electron";
import mime from "mime";
import { createServer, ViteDevServer } from "vite";
import { createReadStream, promises as fsPromises } from "node:fs";
import { createRequestHandler } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";

let viteServer: ViteDevServer;

const rendererClientPath = join(__dirname, "../../build/client");

function toError(value: unknown) {
  return value instanceof Error ? value : new Error(String(value));
}

declare global {
  // eslint-disable-next-line no-var
  var __electron__: typeof electron;
}

const createViteDevServer = async () => {
  viteServer = await createServer({
    root: ".",
    envDir: join(__dirname, "../.."), // load .env files from the root directory.
  });
  const listen = await viteServer.listen();
  global.__electron__ = electron;
  viteServer.printUrls();

  return `http://localhost:${listen.config.server.port}`;
};

export const initReactRouter = async () => {
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) {
    const serverBuild = // await import(
      //     pathToFileURL(join(__dirname, "../../build/server/index.js")).href
      //   );
      await require(join(__dirname, "../../build/server/index.js"));

    protocol.handle("http", async (req) => {
      const url = new URL(req.url);
      if (
        !["localhost", "127.0.0.1"].includes(url.hostname) ||
        (url.port && url.port !== "80")
      ) {
        return await fetch(req);
      }

      req.headers.append("Referer", req.referrer);
      try {
        const res = await serveAsset(req, rendererClientPath);
        if (res) {
          return res;
        }

        const handler = createRequestHandler(serverBuild, "production");
        return await handler(req, {});
      } catch (err) {
        console.warn(err);
        const { stack, message } = toError(err);
        return new Response(`${stack ?? message}`, {
          status: 500,
          headers: { "content-type": "text/html" },
        });
      }
    });

    return "http://localhost";
  }

  return createViteDevServer();
};

export async function serveAsset(
  req: Request,
  assetsPath: string,
): Promise<Response | undefined> {
  const url = new URL(req.url);
  const fullPath = join(assetsPath, decodeURIComponent(url.pathname));
  if (!fullPath.startsWith(assetsPath)) {
    return;
  }

  const fullPathStat = await fsPromises.stat(fullPath).catch(() => undefined);
  if (!fullPathStat?.isFile()) {
    // Nothing to do for directories.
    return;
  }

  const headers = new Headers();
  const mimeType = mime.getType(fullPath);
  if (mimeType) {
    headers.set("Content-Type", mimeType);
  }

  const body = createReadableStreamFromReadable(createReadStream(fullPath));
  return new Response(body, { headers });
}

app.on("before-quit", async () => {
  if (!viteServer) {
    return;
  }

  try {
    console.info("will close vite-dev-server.");
    await viteServer.close();
    console.info("closed vite-dev-server.");
    app.exit();
  } catch (err) {
    console.error("failed to close Vite server:", err);
  }
});
