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

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader = ({ context }: DataFunctionArgs) => {
  const fullscreen = context?.fullscreen as boolean;
  const general = readGeneral();
  const focusDefault = getFocusDefault(general);
  const focusHistoryDefault = getFocusHistoryDefault(general);

  return { fullscreen, focusDefault, focusHistoryDefault };
};

export default function App() {
  const { fullscreen, focusDefault, focusHistoryDefault } =
    useLoaderData<typeof loader>();

  return (
    <Document>
      <Layout>
        <FocusProvider
          focusDefault={focusDefault}
          focusHistoryDefault={focusHistoryDefault}
        >
          <GamepadProvider>
            <FullscreenProvider fullscreenDefault={fullscreen}>
              <Titlebar />
              <Outlet />
            </FullscreenProvider>
          </GamepadProvider>
        </FocusProvider>
      </Layout>
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
  },
});

function Layout({ children }: { children: ReactNode }) {
  return <Wrapper>{children}</Wrapper>;
}
