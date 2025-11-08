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

export type EmuzeButtonId = Exclude<
  ButtonId,
  "guide" | "paddle1" | "paddle2" | "paddle3" | "paddle4"
>;

export const keyboardMapping = {
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
} satisfies Record<EmuzeButtonId, Sdl.Keyboard.ScancodeNames>;

export const keyboardMappingNintendo = {
  ...keyboardMapping,
  a: keyboardMapping.b,
  b: keyboardMapping.a,
  x: keyboardMapping.y,
  y: keyboardMapping.x,
} satisfies Record<EmuzeButtonId, Sdl.Keyboard.ScancodeNames>;

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

export const isPs3Controller = ({ type }: Sdl.Controller.Device) =>
  type === "ps3";

export const isPs4Controller = ({ type }: Sdl.Controller.Device) =>
  type === "ps4";

export const isGamecubeController = (controllerName: string) =>
  controllerName.toLowerCase().includes("gamecube");

export const isSteamDeckController = ({
  guid,
  vendor,
  product,
  name,
}: Sdl.Joystick.Device) =>
  guid === steamDeck.guid ||
  (vendor === steamDeck.vendor && product === steamDeck.product) ||
  !!name?.startsWith("Steam Deck");

export const isN64Controller = ({
  guid,
  vendor,
  product,
  name,
}: Sdl.Joystick.Device) =>
  guid === gamepadN64.guid ||
  (vendor === gamepadN64.vendor && product === gamepadN64.product) ||
  !!name?.includes("N64");

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
  | "righty"
  | "+rightx"
  | "+righty"
  | "-rightx"
  | "-righty";

export type SdlButtonMapping = Partial<Record<SdlButtonId, string>>;

export const getButtonIndex = (
  mappingObject: SdlButtonMapping,
  buttonId: SdlButtonId,
): string | undefined =>
  mappingObject[buttonId]
    ?.replace("b", "")
    .replace("a", "")
    .replace("~", "")
    .replace("+", "")
    .replace("-", "");

export const isAnalog = (
  mappingObject: SdlButtonMapping,
  sdlButtonId: SdlButtonId,
) => mappingObject[sdlButtonId]?.includes("a");

type AxisValue = "+" | "-" | "-+" | undefined;

export const getAxis = (
  mappingObject: SdlButtonMapping,
  sdlButtonId: SdlButtonId,
): AxisValue => {
  const mapping = mappingObject[sdlButtonId];

  if (mapping) {
    if (mapping.includes("-") && mapping.includes("+")) {
      return "-+";
    }
    if (mapping.includes("-")) {
      return "-";
    }
    if (mapping.includes("+")) {
      return "+";
    }
  }

  return undefined;
};

export const isDpadHat = (
  mappingObject: SdlButtonMapping,
  sdlButtonId: SdlButtonId,
) => mappingObject[sdlButtonId]?.includes("h");

export const getPlayerIndexArray = (gamepads: Sdl.Joystick.Device[]) => {
  const playerIndexArray: number[] = [];

  const gamepadsSorted = gamepads
    .toSorted(sortGamecubeLast)
    .toSorted(sortSteamDeckLast);

  gamepads.forEach((gamepad) => {
    playerIndexArray.push(
      gamepadsSorted.findIndex((gamepadSorted) => gamepad === gamepadSorted),
    );
  });

  return playerIndexArray;
};

export const getPlayerIdArray = (gamepads: Sdl.Joystick.Device[]) => {
  const playerIdArray: number[] = [];

  const gamepadsSorted = gamepads
    .toSorted(sortGamecubeLast)
    .toSorted(sortSteamDeckLast);

  gamepads.forEach((gamepad) => {
    playerIdArray.push(
      gamepadsSorted.find((gamepadSorted) => gamepad === gamepadSorted)!.id,
    );
  });

  return playerIdArray;
};

/**
 *
 * @param sdlMapping "030000004c050000c405000000010000,PS4 Controller,platform:Windows,a:b1,b:b2,back:b8,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b4,leftstick:b10,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b11,righttrigger:a4,rightx:a2,righty:a5,start:b9,x:b0,y:b3,"
 */
export const createSdlMappingObject = (sdlMapping: string): SdlButtonMapping =>
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
  id: 2,
  type: "xboxOne",
  name: "Xbox One Wireless Controller",
  path: "/dev/input/event19",
  guid: "050095ac5e040000e002000003090000",
  vendor: 1118,
  product: 736,
  version: 2307,
  player: 2,
  mapping:
    "050095ac5e040000e002000003090000,Xbox One Wireless Controller,a:b0,b:b1,back:b6,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b10,leftshoulder:b4,leftstick:b8,lefttrigger:a2,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b9,righttrigger:a5,rightx:a3,righty:a4,start:b7,x:b2,y:b3,",
} satisfies Sdl.Controller.Device;

/**
 * This is the SDL definition of the internal gamepad of the Steam Deck
 */
export const steamDeck = {
  id: 0,
  type: "virtual",
  name: "Steam Virtual Gamepad",
  path: "/dev/input/event6",
  guid: "030079f6de280000ff11000001000000",
  vendor: 10462,
  product: 4613, // 4607
  version: 1,
  player: 0,
  mapping:
    "030079f6de280000ff11000001000000,Steam Virtual Gamepad,a:b0,b:b1,back:b6,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b8,leftshoulder:b4,leftstick:b9,lefttrigger:a2,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b10,righttrigger:a5,rightx:a3,righty:a4,start:b7,x:b2,y:b3,platform:Linux,",
} satisfies Sdl.Controller.Device;

export const gamepadN64 = {
  id: 0,
  name: "NSO N64 Controller",
  path: "/dev/input/event27",
  type: null,
  guid: "05001c5e7e0500001920000001800000",
  vendor: 1406,
  product: 8217,
  version: 32769,
  player: 0,
  mapping:
    "05001c5e7e0500001920000001800000,NSO N64 Controller,+rightx:b2,+righty:b3,-rightx:b4,-righty:b10,a:b0,b:b1,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b6,lefttrigger:b8,leftx:a0,lefty:a1,misc1:b5,rightshoulder:b7,righttrigger:b9,start:b11,platform:Linux,crc:5e1c,",
} satisfies Sdl.Controller.Device;

export const gamepadPs4 = {
  id: 1,
  name: "PS4 Controller",
  path: "/dev/hidraw1",
  type: "ps4",
  guid: "03008fe54c050000c405000000006800",
  vendor: 1356,
  product: 1476,
  version: null,
  player: 1,
  mapping:
    "03008fe54c050000c405000000006800,*,a:b0,b:b1,back:b4,dpdown:b12,dpleft:b13,dpright:b14,dpup:b11,guide:b5,leftshoulder:b9,leftstick:b7,lefttrigger:a4,leftx:a0,lefty:a1,rightshoulder:b10,rightstick:b8,righttrigger:a5,rightx:a2,righty:a3,start:b6,x:b2,y:b3,touchpad:b15,crc:e58f,",
} satisfies Sdl.Controller.Device;

export const gamepadPs3 = {
  id: 2,
  name: "PS3 Controller",
  path: "/dev/input/event28",
  type: "ps3",
  guid: "0500f9d24c0500006802000000800000",
  vendor: 1356,
  product: 616,
  version: 32768,
  player: 0,
  mapping:
    "0500f9d24c0500006802000000800000,PS3 Controller,a:b0,b:b1,back:b8,dpdown:b14,dpleft:b15,dpright:b16,dpup:b13,guide:b10,leftshoulder:b4,leftstick:b11,lefttrigger:a2,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b12,righttrigger:a5,rightx:a3,righty:a4,start:b9,x:b3,y:b2,platform:Linux,",
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

export const nsoNes = {
  id: 6,
  name: "NSO NES Controller",
  path: "/dev/input/event27",
  type: null,
  guid: "0500a7a57e0500000720000001800000",
  vendor: 1406,
  product: 8199,
  version: 32769,
  player: 0,
  mapping:
    "0500a7a57e0500000720000001800000,NSO NES Controller,a:b0,b:b1,back:b4,start:b5,leftshoulder:b2,rightshoulder:b3,dpup:h0.1,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,platform:Linux,",
} satisfies Sdl.Controller.Device;

export const retroShooterReaper = {
  id: 0,
  name: "3AGAME 3A-3H Retro Shooter 1",
  path: "/dev/input/event24",
  type: null,
  guid: "0300c31d830400005057000011010000",
  vendor: 1155,
  product: 22352,
  version: 273,
  player: null,
} satisfies Sdl.Joystick.Device;

export const isLightgunConnected = (joysticks: Sdl.Joystick.Device[]) =>
  !!joysticks.find(
    ({ name, vendor }) =>
      name?.includes("Retro Shooter") && vendor === retroShooterReaper.vendor,
  );

export const convertToJoystick = (
  controller: Sdl.Controller.Device,
): Sdl.Joystick.Device => ({
  ...controller,
  type: "gamecontroller",
});

export const sortLast = <T>(
  a: T,
  b: T,
  shouldBeLast: (element: T) => boolean,
) => {
  const aShouldBeLast = shouldBeLast(a);
  const bShouldBeLast = shouldBeLast(b);
  if (aShouldBeLast === bShouldBeLast) {
    return 0;
  }
  if (!aShouldBeLast && bShouldBeLast) {
    return -1;
  }
  return 1;
};

/**
 * If one of the gamepads is the Steam Deck, it should be positioned last.
 */
export const sortSteamDeckLast = (
  a: Sdl.Joystick.Device,
  b: Sdl.Joystick.Device,
) => sortLast(a, b, isSteamDeckController);

/**
 * If one of the gamepads is a GameCube Controller, it should be positioned last.
 */
export const sortGamecubeLast = (
  a: Sdl.Joystick.Device,
  b: Sdl.Joystick.Device,
) => sortLast(a.name!, b.name!, isGamecubeController);

export const removeVendorFromGuid = (guid: string): string =>
  guid.substring(0, 4) + "0000" + guid.substring(8);
