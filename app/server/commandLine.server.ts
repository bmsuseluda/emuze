export const commandLineOptions = {
  help: { id: "help", description: "Show help" },
  fullscreen: {
    id: "fullscreen",
    description: "Start the app in fullscreen mode",
  },
  debugEmuze: {
    id: "debugEmuze",
    description: "Activates verbose logging to .emuze/emuze.log",
  },
  rmgN64: {
    id: "rmgN64",
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
