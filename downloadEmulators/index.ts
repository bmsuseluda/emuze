import { ApplicationId } from "../app/server/applicationsDB.server/applicationId";

type EmulatorDownloads = Record<ApplicationId, string>;

const emulatorDownloadsLinux: Partial<EmulatorDownloads> = {
  ryujinx:
    "https://github.com/GreemDev/Ryujinx/releases/download/1.2.72/ryujinx-1.2.72-linux_x64.tar.gz",
};

const emulatorDownloadsWindows: Partial<EmulatorDownloads> = {
  ryujinx:
    "https://github.com/GreemDev/Ryujinx/releases/download/1.2.72/ryujinx-1.2.72-win_x64.zip",
};

export const downloadEmulatorsLinux = () => {};
