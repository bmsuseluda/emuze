export interface ConfigFile {
  "?xml": { "@_version": "1.0"; "@_encoding": "UTF-8" };
  content: {
    check_update: boolean;
    GamePaths?: {
      Entry: string;
    };
  };
}

export interface ControllerConfigFile {
  "?xml": { "@_version": "1.0"; "@_encoding": "UTF-8" };
  emulated_controller: {
    controller: {
      api: "SDLController" | "Keyboard";
      uuid: "keyboard" | string;
      display_name: string;
    };
  };
}
