import type { Sdl } from "@kmamal/sdl";

/**
 * This is the SDL definition of the internal gamepad of the Steam Deck
 */
export const steamDeck: Sdl.Controller.Device = {
  id: 0,
  name: "Microsoft X-Box 360 pad 0",
  path: "/dev/input/event6",
  guid: "030079f6de280000ff11000001000000",
  vendor: 10462,
  product: 4607,
  version: 1,
  player: 0,
  mapping:
    "030079f6de280000ff11000001000000,Steam Virtual Gamepad,a:b0,b:b1,back:b6,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b8,leftshoulder:b4,leftstick:b9,lefttrigger:a2,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b10,righttrigger:a5,rightx:a3,righty:a4,start:b7,x:b2,y:b3,platform:Linux,",
};

export const gamepadPs4: Sdl.Controller.Device = {
  id: 1,
  name: "Playstation 4 Controller",
  path: "/dev/input/event6",
  guid: "030079f6de280000ff11000001000000",
  vendor: 1356,
  product: 1476,
  version: 1,
  player: 1,
  mapping:
    "030000004c050000c405000000010000,PS4 Controller,platform:Windows,a:b1,b:b2,back:b8,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b4,leftstick:b10,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b11,righttrigger:a4,rightx:a2,righty:a5,start:b9,x:b0,y:b3,",
};

export const gamepadPs3: Sdl.Controller.Device = {
  id: 2,
  name: "Playstation 3 Controller",
  path: "/dev/input/event7",
  guid: "030079f6de280000ff11000001000000",
  vendor: 1356,
  product: 616,
  version: 1,
  player: 2,
  mapping:
    "030000004c050000c408000000010000,PS3 Controller,platform:Windows,a:b1,b:b2,back:b8,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b4,leftstick:b10,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b11,righttrigger:a4,rightx:a2,righty:a5,start:b9,x:b0,y:b3,",
};
