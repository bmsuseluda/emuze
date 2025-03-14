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
  noSandbox: {
    id: "no-sandbox",
    description:
      "Necessary if emuze is used as a non steam game (Steam Deck Game Mode)",
  },
} satisfies Record<string, { id: string; description: string }>;

export const commandLineOptionsString = `Usage: emuze [options]

Options:
${Object.values(commandLineOptions)
  .map(({ id, description }) => `  --${id.padEnd(16)} ${description}`)
  .join("\n")}`;
