import isCi from "is-ci";
import { getLogFilePath } from "./log.server.js";

export const commandLineOptions = {
  help: { id: "help", description: "Show help" },
  fullscreen: {
    id: "fullscreen",
    description: "Start the app in fullscreen mode",
  },
  debugEmuze: {
    id: "debug-emuze",
    description: `Activates verbose logging to ${isCi ? "/home/.local/share/emuze/emuze.log" : getLogFilePath()}`,
  },
} satisfies Record<string, { id: string; description: string }>;

export const commandLineOptionsString = `Usage: emuze [options]

Options:
${Object.values(commandLineOptions)
  .map(({ id, description }) => `  --${id.padEnd(16)} ${description}`)
  .join("\n")}`;
