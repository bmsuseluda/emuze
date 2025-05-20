/**
 * This module is based on https://github.com/sindresorhus/env-paths/tree/main
 * A big thank you to Sindre Sorhus for the great work.
 */

import nodepath from "node:path";
import os from "node:os";
import process from "node:process";

const homedir = os.homedir();
const tmpdir = os.tmpdir();
const { env } = process;

const macos = (name: string) => {
  const library = nodepath.join(homedir, "Library");

  return {
    data: nodepath.join(library, "Application Support", name),
    config: nodepath.join(library, "Preferences", name),
    cache: nodepath.join(library, "Caches", name),
    log: nodepath.join(library, "Logs", name),
    temp: nodepath.join(tmpdir, name),
  };
};

const windows = (name: string) => {
  const appData = env.APPDATA || nodepath.join(homedir, "AppData", "Roaming");
  const localAppData =
    env.LOCALAPPDATA || nodepath.join(homedir, "AppData", "Local");

  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: nodepath.join(localAppData, name, "Data"),
    config: nodepath.join(appData, name, "Config"),
    cache: nodepath.join(localAppData, name, "Cache"),
    log: nodepath.join(localAppData, name, "Log"),
    temp: nodepath.join(tmpdir, name),
  };
};

// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
const linux = (name: string) => {
  const username = nodepath.basename(homedir);

  return {
    data: nodepath.join(
      env.XDG_DATA_HOME || nodepath.join(homedir, ".local", "share"),
      name,
    ),
    config: nodepath.join(
      env.XDG_CONFIG_HOME || nodepath.join(homedir, ".config"),
      name,
    ),
    cache: nodepath.join(
      env.XDG_CACHE_HOME || nodepath.join(homedir, ".cache"),
      name,
    ),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: nodepath.join(
      env.XDG_STATE_HOME || nodepath.join(homedir, ".local", "state"),
      name,
    ),
    temp: nodepath.join(tmpdir, username, name),
  };
};

export interface Paths {
  /**
   Directory for data files.

   Example locations (with the default `nodejs` suffix):

   - macOS: `~/Library/Application Support/MyApp-nodejs`
   - Windows: `%LOCALAPPDATA%\MyApp-nodejs\Data` (for example, `C:\Users\USERNAME\AppData\Local\MyApp-nodejs\Data`)
   - Linux: `~/.local/share/MyApp-nodejs` (or `$XDG_DATA_HOME/MyApp-nodejs`)
   */
  readonly data: string;

  /**
   Directory for data files.

   Example locations (with the default `nodejs` suffix):

   - macOS: `~/Library/Preferences/MyApp-nodejs`
   - Windows: `%APPDATA%\MyApp-nodejs\Config` (for example, `C:\Users\USERNAME\AppData\Roaming\MyApp-nodejs\Config`)
   - Linux: `~/.config/MyApp-nodejs` (or `$XDG_CONFIG_HOME/MyApp-nodejs`)
   */
  readonly config: string;

  /**
   Directory for non-essential data files.

   Example locations (with the default `nodejs` suffix):

   - macOS: `~/Library/Caches/MyApp-nodejs`
   - Windows: `%LOCALAPPDATA%\MyApp-nodejs\Cache` (for example, `C:\Users\USERNAME\AppData\Local\MyApp-nodejs\Cache`)
   - Linux: `~/.cache/MyApp-nodejs` (or `$XDG_CACHE_HOME/MyApp-nodejs`)
   */
  readonly cache: string;

  /**
   Directory for log files.

   Example locations (with the default `nodejs` suffix):

   - macOS: `~/Library/Logs/MyApp-nodejs`
   - Windows: `%LOCALAPPDATA%\MyApp-nodejs\Log` (for example, `C:\Users\USERNAME\AppData\Local\MyApp-nodejs\Log`)
   - Linux: `~/.local/state/MyApp-nodejs` (or `$XDG_STATE_HOME/MyApp-nodejs`)
   */
  readonly log: string;

  /**
   Directory for temporary files.

   Example locations (with the default `nodejs` suffix):

   - macOS: `/var/folders/jf/f2twvvvs5jl_m49tf034ffpw0000gn/T/MyApp-nodejs`
   - Windows: `%LOCALAPPDATA%\Temp\MyApp-nodejs` (for example, `C:\Users\USERNAME\AppData\Local\Temp\MyApp-nodejs`)
   - Linux: `/tmp/USERNAME/MyApp-nodejs`
   */
  readonly temp: string;
}

export interface Options {
  /**
   __Don't use this option unless you really have to!__

   Suffix appended to the project name to avoid name conflicts with native apps. Pass an empty string to disable it.

   @default 'nodejs'
   */
  readonly suffix?: string;
}

export const envPaths = (
  name: string,
  { suffix = "nodejs" }: Options = {},
): Paths => {
  if (suffix) {
    // Add suffix to prevent possible conflict with native apps
    name += `-${suffix}`;
  }

  if (process.platform === "darwin") {
    return macos(name);
  }

  if (process.platform === "win32") {
    return windows(name);
  }

  return linux(name);
};
