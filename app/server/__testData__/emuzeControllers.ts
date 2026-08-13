import {
  eightBitDoPro2,
  eightBitDoPro2Joystick,
  gamepadPs4,
  gamepadPs4Joystick,
  steamController,
  steamControllerJoystick,
  steamDeck,
  steamDeckJoystick,
} from "../../types/gamepad.js";
import {
  createEmuzeController,
  EmuzeController,
  steamHandleGUIDs,
} from "../gamepad.server.js";

export const steamControllerEmuzeController = createEmuzeController({
  controller: steamController,
  joystick: steamControllerJoystick,
  hasSteamHandle: true,
  playerIndex: 0,
  steamGUID: steamHandleGUIDs[0],
  hidName: "dummy",
  serialNumber: "dummy",
})!;

export const steamDeckEmuzeController = createEmuzeController({
  controller: steamDeck,
  joystick: steamDeckJoystick,
  hasSteamHandle: true,
  playerIndex: 3,
  steamGUID: steamHandleGUIDs[3],
  hidName: "dummy",
  serialNumber: "dummy",
})!;

export const emuzeControllersSteamInput: EmuzeController[] = [
  steamControllerEmuzeController,
  createEmuzeController({
    controller: eightBitDoPro2,
    joystick: eightBitDoPro2Joystick,
    hasSteamHandle: true,
    playerIndex: 1,
    steamGUID: steamHandleGUIDs[1],
    hidName: "dummy",
    serialNumber: "dummy",
  })!,
  createEmuzeController({
    controller: gamepadPs4,
    joystick: gamepadPs4Joystick,
    hasSteamHandle: true,
    playerIndex: 2,
    steamGUID: steamHandleGUIDs[2],
    hidName: "dummy",
    serialNumber: "dummy",
  })!,
  steamDeckEmuzeController,
];
