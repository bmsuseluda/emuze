import { eightBitDoPro2 } from "../app/types/gamepad.js";

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

    return [];
  },
};

export default hidMock;
