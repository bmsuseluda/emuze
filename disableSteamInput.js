const fs = require("fs");
const path = require("path");
const os = require("os");

const configFilePath = path.join(
  os.homedir(),
  ".steam",
  "steam",
  "config",
  "config.vdf",
);

const disableSteamInputForNonSteamApp = (appName) => {
  try {
    let configContent = fs.readFileSync(configFilePath, "utf8");
    const appConfigRegex = new RegExp(
      `"${appName}"[\\s\\S]*?"EnableSteamInput"[\\s]*"1"`,
      "g",
    );

    if (appConfigRegex.test(configContent)) {
      configContent = configContent.replace(appConfigRegex, (match) =>
        match.replace('"1"', '"0"'),
      );
    } else {
      const appConfigSection = `"${appName}"\n{\n\t"EnableSteamInput" "0"\n}`;
      configContent += `\n${appConfigSection}`;
    }

    fs.writeFileSync(configFilePath, configContent, "utf8");
    console.log(
      `Steam Input has been disabled for non-Steam application: ${appName}`,
    );
  } catch (error) {
    console.error(
      "Error disabling Steam Input for the non-Steam application:",
      error,
    );
  }
};

const appName = "emuze"; // Replace with your application's name
disableSteamInputForNonSteamApp(appName);
