import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Titlebar } from "./containers/Titlebar";
import type { LinksFunction } from "@remix-run/node";
import { FullscreenProvider } from "./provider/FullscreenProvider";
import { FocusProvider } from "./provider/FocusProvider";
import { getFocusDefault, getFocusHistoryDefault } from "./types/focusElement";
import type { ReactNode } from "react";
import { useEffect } from "react";
import type { DataFunctionArgs } from "./context";

import styles from "./index.css?url";
import { styled } from "../styled-system/jsx";
import { readGeneral } from "./server/settings.server";
import { GamepadProvider } from "./provider/GamepadProvider";
import { useGamepadConnected } from "./hooks/useGamepadConnected";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader = ({ context }: DataFunctionArgs) => {
  const fullscreen = context?.fullscreen as boolean;
  const general = readGeneral();
  const focusDefault = getFocusDefault(general);
  const focusHistoryDefault = getFocusHistoryDefault(general);

  return { fullscreen, focusDefault, focusHistoryDefault };
};

const ElectronFocusProvider = ({ children }: { children: ReactNode }) => {
  const { disableGamepads, enableGamepads } = useGamepadConnected();

  useEffect(() => {
    window.electronAPI &&
      window.electronAPI.onBlur(() => {
        disableGamepads();
      });

    window.electronAPI &&
      window.electronAPI.onFocus(() => {
        enableGamepads();
      });
  }, [enableGamepads, disableGamepads]);

  return <>{children}</>;
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
            <ElectronFocusProvider>
              <FullscreenProvider fullscreenDefault={fullscreen}>
                <Titlebar />
                <Outlet />
              </FullscreenProvider>
            </ElectronFocusProvider>
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
