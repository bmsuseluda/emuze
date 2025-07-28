import type { Sdl } from "@kmamal/sdl";

export interface GamepadData {
  gamepadType: GamepadType;
  buttonId: ButtonId;
  eventType: "buttonDown" | "buttonUp";
}

export type GamepadType = "Nintendo" | "XBox" | "PlayStation";

export type ButtonId =
  | "dpadUp"
  | "dpadDown"
  | "dpadLeft"
  | "dpadRight"
  | "a"
  | "b"
  | "x"
  | "y"
  | "guide"
  | "back"
  | "start"
  | "leftStick"
  | "rightStick"
  | "leftShoulder"
  | "rightShoulder"
  | "paddle1"
  | "paddle2"
  | "paddle3"
  | "paddle4"
  | "leftTrigger"
  | "rightTrigger"
  | "leftStickUp"
  | "leftStickDown"
  | "leftStickLeft"
  | "leftStickRight"
  | "rightStickUp"
  | "rightStickDown"
  | "rightStickLeft"
  | "rightStickRight";

export const keyboardMapping: Omit<
  Record<ButtonId, Sdl.Keyboard.ScancodeNames>,
  "guide" | "paddle1" | "paddle2" | "paddle3" | "paddle4"
> = {
  dpadUp: "T",
  dpadDown: "G",
  dpadLeft: "F",
  dpadRight: "H",
  a: "J",
  b: "K",
  x: "U",
  y: "I",
  back: "BACKSPACE",
  start: "RETURN",
  leftStick: "X",
  rightStick: "RSHIFT",
  leftShoulder: "L",
  rightShoulder: "O",
  leftTrigger: "8",
  rightTrigger: "9",
  leftStickUp: "W",
  leftStickDown: "S",
  leftStickLeft: "A",
  leftStickRight: "D",
  rightStickUp: "UP",
  rightStickDown: "DOWN",
  rightStickLeft: "LEFT",
  rightStickRight: "RIGHT",
};

export const getGamepadButtonEventName = (buttonId: ButtonId) =>
  `gamepadonbutton${buttonId.toLowerCase()}press`;

/**
 * check all devices until sdlIndex (current index) for name. count how much and return accordingly
 *
 * @return number starts with 0
 */
export const getNameIndex = (
  name: string,
  sdlIndex: number,
  devices: { name: string | null }[],
) => {
  if (devices.length === 1) {
    return 1;
  }

  let nameCount = 0;
  for (let index = 0; index < sdlIndex; index++) {
    if (devices[index].name === name) {
      nameCount++;
    }
  }

  return nameCount;
};

const xinputControllerTypes: Sdl.Controller.ControllerType[] = [
  "xbox360",
  "xboxOne",
  null,
];
export const isXinputController = (
  controllerType: Sdl.Controller.ControllerType | null,
) => xinputControllerTypes.includes(controllerType);

const dinputControllerTypes: Sdl.Controller.ControllerType[] = [
  "ps3",
  "ps4",
  "ps5",
];
export const isDinputController = (
  controllerType: Sdl.Controller.ControllerType | null,
) => dinputControllerTypes.includes(controllerType);

export const isGamecubeController = (controllerName: string) =>
  controllerName.toLowerCase().includes("gamecube");

export const isSteamDeckController = ({
  guid,
  vendor,
  product,
  name,
}: Sdl.Joystick.Device | Sdl.Controller.Device) =>
  guid === steamDeck.guid ||
  (vendor === steamDeck.vendor && product === steamDeck.product) ||
  name?.startsWith("Steam Deck");

export type SdlButtonId =
  | "a"
  | "b"
  | "x"
  | "y"
  | "back"
  | "start"
  | "guide"
  | "dpdown"
  | "dpleft"
  | "dpright"
  | "dpup"
  | "leftshoulder"
  | "rightshoulder"
  | "lefttrigger"
  | "righttrigger"
  | "leftstick"
  | "rightstick"
  | "leftx"
  | "lefty"
  | "rightx"
  | "righty";

export type SdlButtonMapping = Partial<Record<SdlButtonId, string>>;

export const getButtonIndex = (
  mappingObject: SdlButtonMapping,
  buttonId: SdlButtonId,
): string | undefined =>
  mappingObject[buttonId]?.replace("b", "").replace("a", "");

export const isAnalog = (
  mappingObject: SdlButtonMapping,
  sdlButtonId: SdlButtonId,
) => mappingObject[sdlButtonId]?.startsWith("a");

/**
 *
 * @param sdlMapping "030000004c050000c405000000010000,PS4 Controller,platform:Windows,a:b1,b:b2,back:b8,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b4,leftstick:b10,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b11,righttrigger:a4,rightx:a2,righty:a5,start:b9,x:b0,y:b3,"
 */
export const createSdlMappingObject = (sdlMapping: string) =>
  sdlMapping
    .split(",")
    .reduce<SdlButtonMapping>((accumulator, currentValue) => {
      if (currentValue.includes(":")) {
        const [key, value] = currentValue.split(":");
        accumulator[key as SdlButtonId] = value;
      }
      return accumulator;
    }, {});

export const eightBitDoPro2 = {
  id: 0,
  type: "xboxOne",
  name: "Xbox One Wireless Controller",
  path: "/dev/input/event19",
  guid: "050095ac5e040000e002000003090000",
  vendor: 1118,
  product: 736,
  version: 2307,
  player: 0,
  mapping:
    "050095ac5e040000e002000003090000,Xbox One Wireless Controller,a:b0,b:b1,back:b6,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b10,leftshoulder:b4,leftstick:b8,lefttrigger:a2,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b9,righttrigger:a5,rightx:a3,righty:a4,start:b7,x:b2,y:b3,",
} satisfies Sdl.Controller.Device;

/**
 * This is the SDL definition of the internal gamepad of the Steam Deck
 */
export const steamDeck = {
  id: 0,
  type: "virtual",
  name: "Microsoft X-Box 360 pad 0",
  path: "/dev/input/event6",
  guid: "030079f6de280000ff11000001000000",
  vendor: 10462,
  product: 4607,
  version: 1,
  player: 0,
  mapping:
    "030079f6de280000ff11000001000000,Steam Virtual Gamepad,a:b0,b:b1,back:b6,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b8,leftshoulder:b4,leftstick:b9,lefttrigger:a2,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b10,righttrigger:a5,rightx:a3,righty:a4,start:b7,x:b2,y:b3,platform:Linux,",
} satisfies Sdl.Controller.Device;

export const gamepadPs4 = {
  id: 1,
  type: "ps4",
  name: "Playstation 4 Controller",
  path: "/dev/input/event6",
  guid: "030000004c050000c405000000010000",
  vendor: 1356,
  product: 1476,
  version: 1,
  player: 1,
  mapping:
    "030000004c050000c405000000010000,PS4 Controller,platform:Windows,a:b1,b:b2,back:b8,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b4,leftstick:b10,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b11,righttrigger:a4,rightx:a2,righty:a5,start:b9,x:b0,y:b3,",
} satisfies Sdl.Controller.Device;

export const gamepadPs3 = {
  id: 2,
  type: "ps3",
  name: "Playstation 3 Controller",
  path: "/dev/input/event7",
  guid: "0300afd34c0500006802000011810000",
  vendor: 1356,
  product: 616,
  version: 1,
  player: 2,
  mapping:
    "0300afd34c0500006802000011810000,PS3 Controller,platform:Windows,a:b1,b:b2,back:b8,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b4,leftstick:b10,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b11,righttrigger:a4,rightx:a2,righty:a5,start:b9,x:b0,y:b3,",
} satisfies Sdl.Controller.Device;

export const gamecubeAdapter = {
  id: 5,
  name: "Mayflash GameCube Adapter",
  path: "/dev/input/event5",
  guid: "0300767a790000004318000010010000",
  type: null,
  vendor: 121,
  product: 6211,
  version: 272,
  player: 5,
  mapping:
    "0300767a790000004318000010010000,Mayflash GameCube Adapter,a:b1,b:b0,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b7,righttrigger:a4,rightx:a5,righty:a2,start:b9,x:b2,y:b3,platform:Linux,",
} satisfies Sdl.Controller.Device;

export const convertToJoystick = (
  controller: Sdl.Controller.Device,
): Sdl.Joystick.Device => ({
  ...controller,
  type: "gamecontroller",
});
