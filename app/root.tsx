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
import { useGamepads } from "~/hooks/useGamepads";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { FullscreenProvider } from "~/provider/FullscreenProvider";
import { FocusProvider } from "~/provider/FocusProvider";
import { focusDefault, FocusElements } from "~/types/focusElements";
import { useFocus } from "~/hooks/useFocus";

export default function App() {
  globalStyles();
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

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

export const loader: LoaderFunction = ({ context }) => {
  return json({ fullscreen: context?.fullscreen });
};

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { fullscreen } = useLoaderData<typeof loader>();

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
        <FullscreenProvider fullscreenDefault={fullscreen}>
          <FocusProvider focusDefault={focusDefault}>
            <Titlebar />
            {children}
          </FocusProvider>
        </FullscreenProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { isDisabled } = useFocus<FocusElements>("main");

  useGamepads(isDisabled);

  return (
    <Box
      className={themes.dark}
      css={{ height: "100vh", display: "flex", flexFlow: "column" }}
    >
      {children}
    </Box>
  );
}
