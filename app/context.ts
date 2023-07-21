import type { DataFunctionArgs as RemixDataFunctionArgs } from "@remix-run/server-runtime";

export type LoadContext = {
  fullscreen: boolean;
};

export type DataFunctionArgs = Omit<RemixDataFunctionArgs, "context"> & {
  context: LoadContext;
};
