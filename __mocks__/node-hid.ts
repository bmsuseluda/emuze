import { eightBitDoPro2, steamDeck } from "../app/types/gamepad.js";

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

    return [];
  },
};

export default hidMock;
