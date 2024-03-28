import sdl from "@kmamal/sdl";
import type { Application } from "~/server/applicationsDB.server/types";

export const punes: Application = {
  id: "punes",
  name: "puNES",
  fileExtensions: [".nes"],
  flatpakId: "io.github.punesemu.puNES",
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen", "yes");
    }
    optionParams.push("--shortcut.k.video_fullscreen", "F2");
    optionParams.push("--shortcut.k.save_state", "F1");
    optionParams.push("--shortcut.k.load_state", "F3");
    optionParams.push("--shortcut.k.decrement_state_slot", "NULL");
    optionParams.push("--shortcut.k.increment state slot", "NULL");

    optionParams.push("--input.p1j.a", "BTN01");
    optionParams.push("--input.p1j.b", "BTN04");
    optionParams.push("--input.p1j.turboa", "BTN02");
    optionParams.push("--input.p1j.turbob", "BTN03");
    optionParams.push("--input.p1j.select", "BTN11");
    optionParams.push("--input.p1j.start", "BTN12");
    optionParams.push("--input.p1j.up", "up");
    optionParams.push("--input.p1j.down", "down");
    optionParams.push("--input.p1j.left", "left");
    optionParams.push("--input.p1j.right", "right");

    const gamepads = sdl.controller.devices;

    // TODO: Check why the SDL output is different then what punes expects
    // sdl output: 050082795e040000e002000003090000
    // punes set: {FE11FF9C-045E-0396-02E0-01B409030773}
    if (gamepads.length > 0) {
      optionParams.push("--input.p1j.guid", `{${gamepads[0].guid}}`);
    }

    return optionParams;
  },
};
