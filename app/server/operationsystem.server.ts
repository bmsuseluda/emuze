import { platform } from 'os';

export const isWindows = platform() === "win32";