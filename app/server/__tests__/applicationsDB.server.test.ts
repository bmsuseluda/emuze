import { getApplicationData, pcsx2 } from "../applicationsDB.server";

describe("getApplicationData", () => {
  [
    "F:/games/Emulation/emulators/pcSX2-v1.6.2242-windows-64bit-AVX2",
    "F:/games/Emulation/emulators/pcsx2",
    "F:/games/Emulation/emulators/PCSX2",
    "F:/games/Emulation/emulators/This is the new version of PCSX2",
  ].forEach((applicationName) => {
    it(`Should return application data for pcsx2 for applicationName ${applicationName}`, () => {
      expect(getApplicationData(applicationName)).toBe(pcsx2);
    });
  });

  it("Should return undefined for unknown applicationName", () => {
    expect(getApplicationData("unknown")).toBeUndefined();
  });
});
