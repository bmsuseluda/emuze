import { steamDeckJoystick } from "../../types/gamepad.js";
import { getControllers } from "../gamepad.server.js";

vi.mock("@kmamal/sdl");
vi.mock("node-hid");

describe("gamepad.server", () => {
  describe("getControllers", () => {
    it("Should return steam deck last", () => {
      const result = getControllers();
      expect(result.length).toBe(4);
      expect(result.at(-1)?.joystickName).toBe(steamDeckJoystick.name);
    });
  });
});
