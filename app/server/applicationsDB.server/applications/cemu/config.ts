export interface ConfigFile {
  "?xml": { "@_version": "1.0"; "@_encoding": "UTF-8" };
  content: {
    check_update: boolean;
    GamePaths?: {
      Entry: string;
    };
  };
}

export const defaultConfig: ConfigFile = {
  "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
  content: {
    check_update: false,
  },
};
