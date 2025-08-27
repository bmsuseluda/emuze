import sdl from "@kmamal/sdl";
import type { Sdl } from "@kmamal/sdl";

export const getJoystickFromController = (controller: Sdl.Controller.Device) =>
  sdl.joystick.devices.find(({ id }) => controller.id === id);

export const getControllerFromJoystick = (joystick: Sdl.Joystick.Device) =>
  sdl.controller.devices.find(({ id }) => joystick.id === id);
