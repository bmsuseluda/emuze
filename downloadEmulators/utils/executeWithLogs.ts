import { spawnSync } from "node:child_process";

export const executeWithLogs = (
  applicationPath: string,
  args: string[],
): string => {
  const result = spawnSync(applicationPath, args, {
    stdio: ["inherit", "pipe", "inherit"],
    shell: true,
    encoding: "utf8",
  });

  return result.stdout || "";
};
