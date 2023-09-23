import { createEvent, fireEvent, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useGamepadsOnGrid } from ".";
import type { StickDirection } from "~/hooks/useGamepads/layouts";
import { layout } from "~/hooks/useGamepads/layouts";

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
      const onSelectEntry = vi.fn();

      const { result, rerender } = renderHook(
        ({ isInFocus }) => useGamepadsOnGrid(onSelectEntry, isInFocus),
        {
          initialProps: {
            isInFocus: false,
          },
        },
      );

      result.current.entriesRefsGrid.current = entriesRefsGrid.current;

      rerender({ isInFocus: true });

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

    it("Should select last element in second row on dpad down press", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2"],
        ],
      };
      const onSelectEntry = vi.fn();

      const { result, rerender } = renderHook(
        ({ isInFocus }) => useGamepadsOnGrid(onSelectEntry, isInFocus),
        {
          initialProps: {
            isInFocus: false,
          },
        },
      );

      result.current.entriesRefsGrid.current = entriesRefsGrid.current;

      rerender({ isInFocus: true });

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
      pressButton(layout.buttons.DPadDown);

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row2element2",
      });
      expect(onSelectEntry).toBeCalledWith("row2element2");
    });

    it("Should not trigger anything if not in focus", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = vi.fn();

      const { result } = renderHook(() =>
        useGamepadsOnGrid(onSelectEntry, false),
      );

      result.current.entriesRefsGrid = entriesRefsGrid;

      expect(result.current.selectedEntry).toStrictEqual({
        current: undefined,
      });

      // press down to go to second row
      pressButton(layout.buttons.DPadDown);

      expect(result.current.selectedEntry).toStrictEqual({
        current: undefined,
      });
      expect(onSelectEntry).not.toBeCalled();
    });
  });

  describe("LeftAnalogStick Navigation", () => {
    it("Should select first element in second row on left stick down", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = vi.fn();

      const { result, rerender } = renderHook(
        ({ isInFocus }) => useGamepadsOnGrid(onSelectEntry, isInFocus),
        {
          initialProps: {
            isInFocus: false,
          },
        },
      );

      result.current.entriesRefsGrid.current = entriesRefsGrid.current;

      rerender({ isInFocus: true });

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

    it("Should not trigger anything if not in focus", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = vi.fn();

      const { result } = renderHook(() =>
        useGamepadsOnGrid(onSelectEntry, false),
      );

      result.current.entriesRefsGrid = entriesRefsGrid;

      expect(result.current.selectedEntry).toStrictEqual({
        current: undefined,
      });

      // press down to go to second row
      pressStick("leftStickDown");

      expect(result.current.selectedEntry).toStrictEqual({
        current: undefined,
      });
      expect(onSelectEntry).not.toBeCalled();
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
      const onSelectEntry = vi.fn();

      const { result, rerender } = renderHook(
        ({ isInFocus }) => useGamepadsOnGrid(onSelectEntry, isInFocus),
        {
          initialProps: {
            isInFocus: false,
          },
        },
      );

      result.current.entriesRefsGrid.current = entriesRefsGrid.current;

      rerender({ isInFocus: true });

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

    it("Should not trigger anything if not in focus", async () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = vi.fn();

      const { result } = renderHook(() =>
        useGamepadsOnGrid(onSelectEntry, false),
      );

      result.current.entriesRefsGrid = entriesRefsGrid;

      expect(result.current.selectedEntry).toStrictEqual({
        current: undefined,
      });

      // press down to go to second row
      await userEvent.keyboard("{ArrowDown}");

      expect(result.current.selectedEntry).toStrictEqual({
        current: undefined,
      });
      expect(onSelectEntry).not.toBeCalled();
    });
  });
});
