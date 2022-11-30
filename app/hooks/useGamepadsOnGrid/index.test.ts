import { createEvent, fireEvent, renderHook } from "@testing-library/react";

import { useGamepadsOnGrid } from ".";
import layout from "~/hooks/useGamepads/layouts/xbox";

const pressButton = (buttonIndex: number) => {
  fireEvent(window, createEvent(`gamepadonbutton${buttonIndex}press`, window));
};

describe("useGamepadsOnGrid", () => {
  it("Should select first element in first row on initial dpad right press", () => {
    const entriesRefsGrid = {
      current: [
        ["row1element1", "row1element2"],
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

    // press down to go to second row
    pressButton(layout.buttons.DPadDown);

    expect(result.current.selectedEntry).toStrictEqual({
      current: "row2element1",
    });
    expect(onSelectEntry).toBeCalledWith("row2element1");
  });

  it("Should select first element in last row on initial dpad right press", () => {
    const entriesRefsGrid = {
      current: [
        ["row1element1", "row1element2"],
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

    // press down to go to second row
    pressButton(layout.buttons.DPadDown);

    expect(result.current.selectedEntry).toStrictEqual({
      current: "row2element1",
    });
    expect(onSelectEntry).toBeCalledWith("row2element1");
  });
});
