import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useRouteError,
} from "react-router";
import { Titlebar } from "./containers/Titlebar/index.js";
import type { LinksFunction } from "react-router";
import { FullscreenProvider } from "./provider/FullscreenProvider/index.js";
import { FocusProvider } from "./provider/FocusProvider/index.js";
import {
  getFocusDefault,
  getFocusHistoryDefault,
} from "./types/focusElement.js";
import type { ReactNode } from "react";
import type { DataFunctionArgs } from "./context.js";

import styles from "./index.css?url";
import { styled } from "../styled-system/jsx/index.js";
import { readGeneral } from "./server/settings.server.js";
import { GamepadProvider } from "./provider/GamepadProvider/index.js";
import { useFullscreen } from "./hooks/useFullscreen/index.js";
import { isWindows } from "./server/operationsystem.server.js";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader = ({ context }: DataFunctionArgs) => {
  const fullscreen = context?.fullscreen as boolean;
  const general = readGeneral();
  const focusDefault = getFocusDefault(general);
  const focusHistoryDefault = getFocusHistoryDefault(general);
  const windows = isWindows();

  return { fullscreen, focusDefault, focusHistoryDefault, isWindows: windows };
};

export default function App() {
  const { fullscreen, focusDefault, focusHistoryDefault, isWindows } =
    useLoaderData<typeof loader>();

  return (
    <Document>
      <FullscreenProvider fullscreenDefault={fullscreen}>
        <Layout isWindows={isWindows}>
          <FocusProvider
            focusDefault={focusDefault}
            focusHistoryDefault={focusHistoryDefault}
          >
            <GamepadProvider>
              <Titlebar />
              <Outlet />
            </GamepadProvider>
          </FocusProvider>
        </Layout>
      </FullscreenProvider>
    </Document>
  );
}

export const meta = () => [
  { title: "emuze" },
  { name: "description", content: "Your library" },
];

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>Unknown error</pre>
    </div>
  );
}

function Document({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <html lang="en" data-theme="red" data-color-mode="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline'; object-src 'none';"
        />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const Wrapper = styled("div", {
  base: {
    height: "100vh",
    display: "flex",
    flexFlow: "column",
    backgroundColor: "backgroundColor",
    overflow: "inherit",
  },
  variants: {
    fullscreen: {
      true: {
        borderRadius: 0,
      },
      false: {
        borderRadius: "9px",
      },
    },
  },
});

function Layout({ children, isWindows }: { children: ReactNode, isWindows: boolean }) {
  const fullscreen = useFullscreen();

  return <Wrapper fullscreen={fullscreen || isWindows}>{children}</Wrapper>;
}
