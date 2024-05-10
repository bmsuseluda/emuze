import type { LoaderFunctionArgs } from "@remix-run/server-runtime";

export interface LoadContext {
  fullscreen: boolean;
}

export interface DataFunctionArgs extends Omit<LoaderFunctionArgs, "context"> {
  context: LoadContext;
}
