import { createEvent, fireEvent, renderHook } from "@testing-library/react";

import { useGamepadsOnSidebar } from ".";
import type { StickDirection } from "~/hooks/useGamepads/layouts";
import { layout } from "~/hooks/useGamepads/layouts";

const pressButton = (buttonIndex: number) => {
  fireEvent(window, createEvent(`gamepadonbutton${buttonIndex}press`, window));
};
const pressStick = (stickDirection: StickDirection) => {
  fireEvent(window, createEvent(`gamepadon${stickDirection}`, window));
};

// TODO: Write tests
describe("useGamepadsOnSidebar", () => {
  describe("DPadNavigation", () => {
    it("", () => {
      const { result } = renderHook(() => useGamepadsOnSidebar(0, true));
      const element1 = {
        current: {},
      };
      result.current.refCallback(0);
      const element2 = result.current.refCallback(1);
      const element3 = result.current.refCallback(2);

      pressButton(layout.buttons.DPadDown);
    });
  });

  describe("LeftAnalogStick Navigation", () => {
    it("", () => {});
  });

  describe("Keyboard Navigation", () => {
    it("", () => {});
  });
});
