import { createEvent, fireEvent, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useGamepadsOnGrid } from ".";
import { layout } from "~/hooks/useGamepads/layouts";
import type { StickDirection } from "~/hooks/useGamepads/layouts";

const pressButton = (buttonIndex: number) => {
  fireEvent(window, createEvent(`gamepadonbutton${buttonIndex}press`, window));
};
const pressStick = (stickDirection: StickDirection) => {
  fireEvent(window, createEvent(`gamepadon${stickDirection}`, window));
};

describe("useGamepadsOnGrid", () => {
  describe("DPadNavigation", () => {
    it("Should select first element in second row on dpad down press", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = jest.fn();

      const { result } = renderHook(() =>
        useGamepadsOnGrid(entriesRefsGrid, onSelectEntry)
      );

      // press right to go to first element on first row
      pressButton(layout.buttons.DPadRight);

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row1element1",
      });
      expect(onSelectEntry).toBeCalledWith("row1element1");

      // press down to go to second row
      pressButton(layout.buttons.DPadDown);

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row2element1",
      });
      expect(onSelectEntry).toBeCalledWith("row2element1");
    });

    it("Should select first element in last row on dpad up press", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
          ["row3element1", "row3element2", "row3element3"],
        ],
      };
      const onSelectEntry = jest.fn();

      const { result } = renderHook(() =>
        useGamepadsOnGrid(entriesRefsGrid, onSelectEntry)
      );

      // press right to go to first element on first row
      pressButton(layout.buttons.DPadRight);

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row1element1",
      });
      expect(onSelectEntry).toBeCalledWith("row1element1");

      // press up to go to last row
      pressButton(layout.buttons.DPadUp);

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row3element1",
      });
      expect(onSelectEntry).toBeCalledWith("row3element1");

      // press down to go to first row
      pressButton(layout.buttons.DPadDown);

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row1element1",
      });
      expect(onSelectEntry).toBeCalledWith("row1element1");
    });

    it("Should select last element in first row on dpad left press", () => {
      const entriesRefsGrid = {
        current: [["row1element1", "row1element2", "row1element3"]],
      };
      const onSelectEntry = jest.fn();

      const { result } = renderHook(() =>
        useGamepadsOnGrid(entriesRefsGrid, onSelectEntry)
      );

      // press right to go to first element on first row
      pressButton(layout.buttons.DPadRight);

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row1element1",
      });
      expect(onSelectEntry).toBeCalledWith("row1element1");

      // press left to go to last column
      pressButton(layout.buttons.DPadLeft);
      expect(result.current.selectedEntry).toStrictEqual({
        current: "row1element3",
      });
      expect(onSelectEntry).toBeCalledWith("row1element3");

      // press right to go to first column again
      pressButton(layout.buttons.DPadRight);
      expect(result.current.selectedEntry).toStrictEqual({
        current: "row1element1",
      });
      expect(onSelectEntry).toBeCalledWith("row1element1");
    });
  });

  it("Should select last element in last row on dpad up press", () => {
    const entriesRefsGrid = {
      current: [
        ["row1element1", "row1element2", "row1element3"],
        ["row2element1", "row2element2", "row2element3"],
        ["row3element1", "row3element2"],
      ],
    };
    const onSelectEntry = jest.fn();

    const { result } = renderHook(() =>
      useGamepadsOnGrid(entriesRefsGrid, onSelectEntry)
    );

    // press right to go to first element on first row
    pressButton(layout.buttons.DPadRight);

    expect(result.current.selectedEntry).toStrictEqual({
      current: "row1element1",
    });
    expect(onSelectEntry).toBeCalledWith("row1element1");

    // press right 2 times to go to last element on first row
    pressButton(layout.buttons.DPadRight);
    pressButton(layout.buttons.DPadRight);

    expect(result.current.selectedEntry).toStrictEqual({
      current: "row1element3",
    });
    expect(onSelectEntry).toBeCalledWith("row1element3");

    // press up to go to last row
    pressButton(layout.buttons.DPadUp);

    expect(result.current.selectedEntry).toStrictEqual({
      current: "row3element2",
    });
    expect(onSelectEntry).toBeCalledWith("row3element2");
  });

  it("Should select last element in second row on dpad down press", () => {
    const entriesRefsGrid = {
      current: [
        ["row1element1", "row1element2", "row1element3"],
        ["row2element1", "row2element2"],
      ],
    };
    const onSelectEntry = jest.fn();

    const { result } = renderHook(() =>
      useGamepadsOnGrid(entriesRefsGrid, onSelectEntry)
    );

    // press right to go to first element on first row
    pressButton(layout.buttons.DPadRight);

    expect(result.current.selectedEntry).toStrictEqual({
      current: "row1element1",
    });
    expect(onSelectEntry).toBeCalledWith("row1element1");

    // press right 2 times to go to last element on first row
    pressButton(layout.buttons.DPadRight);
    pressButton(layout.buttons.DPadRight);

    expect(result.current.selectedEntry).toStrictEqual({
      current: "row1element3",
    });
    expect(onSelectEntry).toBeCalledWith("row1element3");

    // press down to go to second row
    pressButton(layout.buttons.DPadUp);

    expect(result.current.selectedEntry).toStrictEqual({
      current: "row2element2",
    });
    expect(onSelectEntry).toBeCalledWith("row2element2");
  });

  describe("LeftAnalogStick Navigation", () => {
    it("Should select first element in second row on left stick down", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = jest.fn();

      const { result } = renderHook(() =>
        useGamepadsOnGrid(entriesRefsGrid, onSelectEntry)
      );

      // press right to go to first element on first row
      pressStick("leftStickRight");

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row1element1",
      });
      expect(onSelectEntry).toBeCalledWith("row1element1");

      // press down to go to second row
      pressStick("leftStickDown");

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row2element1",
      });
      expect(onSelectEntry).toBeCalledWith("row2element1");
    });
  });

  describe("Keyboard Navigation", () => {
    it("Should select first element in second row on key down", async () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = jest.fn();

      const { result } = renderHook(() =>
        useGamepadsOnGrid(entriesRefsGrid, onSelectEntry)
      );

      // press right to go to first element on first row
      await userEvent.keyboard("{ArrowRight}");

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row1element1",
      });
      expect(onSelectEntry).toBeCalledWith("row1element1");

      // press down to go to second row
      await userEvent.keyboard("{ArrowDown}");

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row2element1",
      });
      expect(onSelectEntry).toBeCalledWith("row2element1");
    });
  });
});
