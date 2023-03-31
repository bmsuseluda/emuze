import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import { globalStyles, themes } from "./stitches";
import { Box } from "./components/Box";
import { Titlebar } from "./containers/Titlebar";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { FullscreenProvider } from "~/provider/FullscreenProvider";
import { FocusProvider } from "~/provider/FocusProvider";
import type { FocusElement } from "~/types/focusElement";
import { focusDefault } from "~/types/focusElement";
import type { DataFunctionArgs } from "@remix-run/server-runtime/dist/routeModules";
import type { ReactNode } from "react";
import { useFocus } from "~/hooks/useFocus";
import { useGamepads } from "~/hooks/useGamepads";

const GamepadProvider = ({ children }: { children: ReactNode }) => {
  const { isDisabled } = useFocus<FocusElement>("main");
  useGamepads(isDisabled);

  return <>{children}</>;
};

export default function App() {
  globalStyles();
  const { fullscreen } = useLoaderData<typeof loader>();

  return (
    <Document>
      <Layout>
        <FocusProvider focusDefault={focusDefault}>
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

export const meta: MetaFunction = () => ({
  title: "emuze",
  description: "Your library",
});

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

export const loader = ({ context }: DataFunctionArgs) => {
  const fullscreen: boolean | undefined = context?.fullscreen as boolean;
  return json({ fullscreen });
};

function Document({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      className={themes.dark}
      css={{
        height: "100vh",
        display: "flex",
        flexFlow: "column",
        backgroundColor: "$backgroundColor",
      }}
    >
      {children}
    </Box>
  );
}
