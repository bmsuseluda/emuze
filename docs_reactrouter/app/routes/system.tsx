import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Route } from "./+types/system";
import { readFileSync } from "node:fs";
import nodepath from "node:path";

const __dirname = import.meta.dirname;
const systemsPath = nodepath.join(__dirname, "..", "..", "systems");

export async function loader({ params }: Route.LoaderArgs) {
  const systemId = params.systemId;
  // TODO: only go further if systemId is known
  const markdown = readFileSync(nodepath.join(systemsPath, `${systemId}.md`), {
    encoding: "utf8",
  });
  return { markdown };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <Markdown remarkPlugins={[remarkGfm]}>{loaderData?.markdown}</Markdown>
  );
}
