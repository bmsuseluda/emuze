import {
  findEntryNameByFolder,
  getApplicationDataByName,
  pcsx2,
} from "../applicationsDB.server";
import type { Entry } from "~/types/category";

describe("getApplicationData", () => {
  [
    "F:/games/Emulation/emulators/pcSX2-v1.6.2242-windows-64bit-AVX2",
    "F:/games/Emulation/emulators/pcsx2",
    "F:/games/Emulation/emulators/PCSX2",
    "F:/games/Emulation/emulators/This is the new version of PCSX2",
  ].forEach((applicationName) => {
    it(`Should return application data for pcsx2 for applicationName ${applicationName}`, () => {
      expect(getApplicationDataByName(applicationName)).toBe(pcsx2);
    });
  });

  it("Should return undefined for unknown applicationName", () => {
    expect(getApplicationDataByName("unknown")).toBeUndefined();
  });
});

describe("findEntryNameByFolder", () => {
  it("Should return the folder name", () => {
    const entry: Entry = {
      id: "bbusters",
      path: "/long folder structure/Arcade/Beast Busters/bbusters.zip",
      name: "bbusters",
    };
    const categoryPath = "/long folder structure/Arcade";
    const result = findEntryNameByFolder(entry, categoryPath);

    expect(result).toBe("Beast Busters");
  });

  it("Should return the entry name if there is no corresponding folder for this entry", () => {
    const entry: Entry = {
      id: "crashbandicoot",
      path: "/long folder structure/Sony Playstation/Crash Bandicoot.chd",
      name: "Crash Bandicoot",
    };
    const categoryPath = "/long folder structure/Sony Playstation";
    const result = findEntryNameByFolder(entry, categoryPath);

    expect(result).toBe("Crash Bandicoot");
  });
});
