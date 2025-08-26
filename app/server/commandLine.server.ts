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
  rmgN64: {
    id: "rmg",
    description:
      "Activates the less accurate Rosalies Mupen GUI (RMG) emulator to play N64",
  },
  mgba: {
    id: "mgba",
    description: "Activates the mgba emulator to play Game Boy",
  },
  lime3ds: {
    id: "lime3ds",
    description: "Activates the lime3DS emulator to play 3DS",
  },
} satisfies Record<string, { id: string; description: string }>;

export const commandLineOptionsString = `Usage: emuze [options]

Options:
${Object.values(commandLineOptions)
  .map(({ id, description }) => `  --${id.padEnd(16)} ${description}`)
  .join("\n")}`;
