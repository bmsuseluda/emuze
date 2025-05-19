import packageJson from "../../package.json" with {type: "json"};

export const getVersion = () => packageJson.version;