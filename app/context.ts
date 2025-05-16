import type { LoaderFunctionArgs } from "react-router";

export interface LoadContext {
  fullscreen: boolean;
}

export interface DataFunctionArgs extends Omit<LoaderFunctionArgs, "context"> {
  context: LoadContext;
}
