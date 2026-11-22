import { Sdl } from "@kmamal/sdl3";
import { gamepadManager } from "./gamepadManager.server/index.js";
import { isGameRunning } from "./gameIsRunning.server.js";
import { KeyInput, Kimetra } from "kimetra";
import { ApplicationHotkeys, hotkeysDefinition } from "../types/hotkeys.js";

const kimetraSdlMapping = {
  F1: "f1",
  F2: "f2",
  F3: "f3",
  F4: "f4",
  F5: "f5",
  F6: "f6",
  F7: "f7",
  F11: "f11",
} satisfies Partial<Record<Sdl.Keyboard.ScancodeNames, KeyInput>>;

export const registerHotkeysOnGamepadEvents = (
  applicationHotkeys?: ApplicationHotkeys,
) => {
  if (applicationHotkeys) {
    gamepadManager.addButtonDownEvent("inGame", async (event, controller) => {
      if (isGameRunning() && controller.buttons.back) {
        const kimetra = Kimetra();

        applicationHotkeys.forEach((hotkey) => {
          const { gamepadSdl, keyboard } = hotkeysDefinition[hotkey];
          if (event.button === gamepadSdl) {
            kimetra.keyDown(kimetraSdlMapping[keyboard]);
          }
        });
      }
    });

    gamepadManager.addButtonUpEvent("inGame", (event, controller) => {
      if (isGameRunning() && controller.buttons.back) {
        const kimetra = Kimetra();

        kimetra.cleanup();
      }
    });
  }
};
