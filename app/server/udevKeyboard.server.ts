import UInput from "uinput2";

const CREATE_OPTIONS = {
  name: "Wine Launcher Keyboard Emulation",
  id: {
    busType: UInput.BUS_USB,
    vendor: 0x1,
    product: 0x1,
    version: 1,
  },
};

const KeyboardMap = {
  KEY_1: "1",
  KEY_2: "2",
  KEY_3: "3",
  KEY_4: "4",
  KEY_5: "5",
  KEY_6: "6",
  KEY_7: "7",
  KEY_8: "8",
  KEY_9: "9",
  KEY_0: "0",

  KEY_A: "a",
  KEY_B: "b",
  KEY_C: "c",
  KEY_D: "d",
  KEY_E: "e",
  KEY_F: "f",
  KEY_G: "g",
  KEY_H: "h",
  KEY_I: "i",
  KEY_J: "j",
  KEY_K: "k",
  KEY_L: "l",
  KEY_M: "m",
  KEY_N: "n",
  KEY_O: "o",
  KEY_P: "p",
  KEY_Q: "q",
  KEY_R: "r",
  KEY_S: "s",
  KEY_T: "t",
  KEY_U: "u",
  KEY_V: "v",
  KEY_W: "w",
  KEY_X: "x",
  KEY_Y: "y",
  KEY_Z: "z",

  KEY_ESC: "esc",
  KEY_F1: "f1",
  KEY_F2: "f2",
  KEY_F3: "f3",
  KEY_F4: "f4",
  KEY_F5: "f5",
  KEY_F6: "f6",
  KEY_F7: "f7",
  KEY_F8: "f8",
  KEY_F9: "f9",
  KEY_F10: "f10",
  KEY_F11: "f11",
  KEY_F12: "f12",

  KEY_MINUS: "-",
  KEY_EQUAL: "=",
  KEY_LEFTBRACE: "[",
  KEY_RIGHTBRACE: "]",
  KEY_SEMICOLON: ";",
  KEY_APOSTROPHE: "'",
  KEY_GRAVE: "`",
  KEY_BACKSLASH: "\\",
  KEY_DOT: ".",
  KEY_SLASH: "/",

  KEY_BACKSPACE: "backspace",
  KEY_TAB: "tab",
  KEY_ENTER: "enter",
  KEY_COMMA: "command",
  KEY_SPACE: "space",
  KEY_CAPSLOCK: "capslock",
  KEY_SCROLLLOCK: "scroll_lock",

  KEY_LEFTSHIFT: "left_shift",
  KEY_RIGHTSHIFT: "right_shift",
  KEY_LEFTCTRL: "left_ctrl",
  KEY_RIGHTCTRL: "right_ctrl",
  KEY_LEFTALT: "left_alt",
  KEY_RIGHTALT: "right_alt",

  KEY_UP: "up",
  KEY_LEFT: "left",
  KEY_RIGHT: "right",
  KEY_DOWN: "down",

  KEY_HOME: "home",
  KEY_END: "end",
  KEY_PAGEUP: "page_up",
  KEY_PAGEDOWN: "page_down",
  KEY_INSERT: "insert",
  KEY_DELETE: "delete",
  KEY_PRINT: "print_screen",

  KEY_NUMLOCK: "numlock",
  KEY_KP0: "numpad_0",
  KEY_KP1: "numpad_1",
  KEY_KP2: "numpad_2",
  KEY_KP3: "numpad_3",
  KEY_KP4: "numpad_4",
  KEY_KP5: "numpad_5",
  KEY_KP6: "numpad_6",
  KEY_KP7: "numpad_7",
  KEY_KP8: "numpad_8",
  KEY_KP9: "numpad_9",
  KEY_KPMINUS: "numpad_-",
  KEY_KPPLUS: "numpad_+",
  KEY_KPDOT: "numpad_.",
  KEY_KPSLASH: "numpad_/",
  KEY_KPENTER: "numpad_enter",
} satisfies Record<string, string>;

type KeyboardKey = keyof typeof KeyboardMap;

export default class UInputKeyboard {
  runtime = Promise.resolve();
  delay = 2;
  device?: UInput.UInput;

  async createDevice() {
    if (undefined !== this.device) {
      return this.device;
    }

    const SETUP_OPTIONS = {
      UI_SET_EVBIT: [UInput.EV_KEY, UInput.EV_REP, UInput.EV_SYN],
      UI_SET_RELBIT: [],
      UI_SET_KEYBIT: Object.keys(KeyboardMap).map(
        (key) => UInput[key as KeyboardKey],
      ),
    };

    this.device = await UInput.setup(SETUP_OPTIONS);
    this.device.create(CREATE_OPTIONS);

    return this.device;
  }

  async sleep(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  keyToggle(key: KeyboardKey, pressed: boolean) {
    this.createDevice().then((device) => {
      this.runtime = this.runtime
        .then(() => device.keyEvent(UInput[key], pressed))
        .then(() => this.sleep(this.delay));
    });
  }
}
