import type { Sdl } from "@kmamal/sdl";
import HID from "node-hid";

export const getDeviceNameFromHid = ({
  vendor,
  product,
}: Sdl.Joystick.Device) => {
  if (vendor && product) {
    const hidDevices = HID.devices(vendor, product);
    return hidDevices.at(0)?.product;
  }
  return undefined;
};
