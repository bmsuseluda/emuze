import type { LoaderFunctionArgs } from "@remix-run/server-runtime";

export type LoadContext = {
  fullscreen: boolean;
};

export type DataFunctionArgs = Omit<LoaderFunctionArgs, "context"> & {
  context: LoadContext;
};
