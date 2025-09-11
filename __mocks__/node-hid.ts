import { eightBitDoPro2, gamepadPs4, steamDeck } from "../app/types/gamepad.js";

const hidMock = {
  devices: (vendor: number, product: number) => {
    if (
      vendor === eightBitDoPro2.vendor &&
      product === eightBitDoPro2.product
    ) {
      return [
        {
          product: "8BitDo Pro 2",
        },
      ];
    }

    if (vendor === steamDeck.vendor && product === steamDeck.product) {
      return [
        {
          product: "Steam Controller",
        },
      ];
    }

    if (vendor === gamepadPs4.vendor && product === gamepadPs4.product) {
      return [
        {
          product: "Wireless Controller",
        },
      ];
    }

    return [];
  },
};

export default hidMock;
