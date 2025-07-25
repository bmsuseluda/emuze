import { createEvent, fireEvent, renderHook } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { useGamepadsOnGrid } from "./index.js";
import {
  getGamepadButtonEventName,
  type ButtonId,
} from "../../types/gamepad.js";

const pressButton = (buttonId: ButtonId) => {
  fireEvent(window, createEvent(getGamepadButtonEventName(buttonId), window));
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
        ({ isInFocus }) => useGamepadsOnGrid({ onSelectEntry, isInFocus }),
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
      pressButton("dpadDown");

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
        ({ isInFocus }) => useGamepadsOnGrid({ onSelectEntry, isInFocus }),
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
      pressButton("dpadRight");
      pressButton("dpadRight");

      expect(result.current.selectedEntry).toStrictEqual({
        current: "row1element3",
      });
      expect(onSelectEntry).toBeCalledWith("row1element3");

      // press down to go to second row
      pressButton("dpadDown");

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
        useGamepadsOnGrid({ onSelectEntry, isInFocus: false }),
      );

      result.current.entriesRefsGrid = entriesRefsGrid;

      expect(result.current.selectedEntry).toStrictEqual({
        current: undefined,
      });

      // press down to go to second row
      pressButton("dpadDown");

      expect(result.current.selectedEntry).toStrictEqual({
        current: undefined,
      });
      expect(onSelectEntry).not.toBeCalled();
    });

    it("Should call onLeftOverTheEdge", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = vi.fn();
      const onLeftOverTheEdge = vi.fn();

      const { result, rerender } = renderHook(
        ({ isInFocus }) =>
          useGamepadsOnGrid({ onSelectEntry, isInFocus, onLeftOverTheEdge }),
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

      // press left to go over the edge
      pressButton("dpadLeft");

      expect(onLeftOverTheEdge).toBeCalled();
    });

    it("Should call onRightOverTheEdge", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = vi.fn();
      const onRightOverTheEdge = vi.fn();

      const { result, rerender } = renderHook(
        ({ isInFocus }) =>
          useGamepadsOnGrid({ onSelectEntry, isInFocus, onRightOverTheEdge }),
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

      // press right to go over the edge
      pressButton("dpadRight");
      pressButton("dpadRight");
      pressButton("dpadRight");

      expect(onRightOverTheEdge).toBeCalled();
    });

    it("Should call onTopOverTheEdge", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = vi.fn();
      const onTopOverTheEdge = vi.fn();

      const { result, rerender } = renderHook(
        ({ isInFocus }) =>
          useGamepadsOnGrid({ onSelectEntry, isInFocus, onTopOverTheEdge }),
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

      // press up to go over the edge
      pressButton("dpadUp");

      expect(onTopOverTheEdge).toBeCalled();
    });

    it("Should call onBottomOverTheEdge", () => {
      const entriesRefsGrid = {
        current: [
          ["row1element1", "row1element2", "row1element3"],
          ["row2element1", "row2element2", "row2element3"],
        ],
      };
      const onSelectEntry = vi.fn();
      const onBottomOverTheEdge = vi.fn();

      const { result, rerender } = renderHook(
        ({ isInFocus }) =>
          useGamepadsOnGrid({ onSelectEntry, isInFocus, onBottomOverTheEdge }),
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

      // press down to go over the edge
      pressButton("dpadDown");
      pressButton("dpadDown");

      expect(onBottomOverTheEdge).toBeCalled();
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
        ({ isInFocus }) => useGamepadsOnGrid({ onSelectEntry, isInFocus }),
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
      pressButton("leftStickDown");

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
        useGamepadsOnGrid({ onSelectEntry, isInFocus: false }),
      );

      result.current.entriesRefsGrid = entriesRefsGrid;

      expect(result.current.selectedEntry).toStrictEqual({
        current: undefined,
      });

      // press down to go to second row
      pressButton("leftStickDown");

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
        ({ isInFocus }) => useGamepadsOnGrid({ onSelectEntry, isInFocus }),
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
        useGamepadsOnGrid({ onSelectEntry, isInFocus: false }),
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
