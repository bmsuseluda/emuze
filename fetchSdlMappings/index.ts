import nodepath from "node:path";
import { writeFile } from "../app/server/readWriteData.server.js";
import { gamecontrollerdbPath } from "../app/server/bundledEmulatorsPath.server.js";
import { mkdirSync, writeFileSync } from "node:fs";

const __dirname = import.meta.dirname;

const projectPath = nodepath.join(__dirname, "..");
const resultPath = nodepath.join(
  projectPath,
  "app",
  "server",
  "gamepadManager.server",
);

const url =
  "https://raw.githubusercontent.com/mdqinc/SDL_GameControllerDB/refs/heads/master/gamecontrollerdb.txt";

const filterMappings = (mappings: string[], overwrites: string[]) =>
  mappings.filter(
    (mapping) =>
      !overwrites.find((overwrite) =>
        mapping.startsWith(overwrite.split(",")[0]),
      ),
  );

const overwrites = [
  "050000007e0500000720000001800000,NSO NES Controller,a:b0,b:b1,back:b4,start:b5,leftshoulder:b2,rightshoulder:b3,dpup:h0.1,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,platform:Linux,",

  "050000007e0500001720000001800000,NSO SNES Controller,a:b1,b:b0,x:b2,y:b3,back:b8,start:b9,leftshoulder:b4,rightshoulder:b5,dpup:h0.1,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,lefttrigger:b6,righttrigger:b7,platform:Linux,",
  "030000007e0500001720000011810000,NSO SNES Controller,a:b1,b:b0,x:b2,y:b3,back:b8,start:b9,leftshoulder:b4,rightshoulder:b5,dpup:h0.1,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,lefttrigger:b6,righttrigger:b7,platform:Linux,",

  "050000007e0500000620000001800000,Nintendo Switch Left Joy-Con,a:b8,b:b9,back:b5,leftshoulder:b2,leftstick:b6,rightshoulder:b4,lefttrigger:b1,righttrigger:b3,start:b0,x:b10,y:b7,leftx:a1,lefty:a0~,platform:Linux,",

  "050000007e0500001920000001800000,NSO N64 Controller,+rightx:b2,+righty:b3,-rightx:b4,-righty:b10,a:b0,b:b1,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b6,lefttrigger:b8,leftx:a0,lefty:a1,misc1:b5,rightshoulder:b7,righttrigger:b9,start:b11,platform:Linux,",
  "030000007e0500001920000000000000,NSO N64 Controller,a:b0,b:b1,dpdown:b12,dpleft:b13,dpright:b14,dpup:b11,guide:b5,leftshoulder:b9,lefttrigger:a4~,leftx:a0,lefty:a1,rightshoulder:b10,righttrigger:b7,start:b6,-rightx:b2,+rightx:b4,-righty:b3,+righty:+a5,platform:Windows,",

  "03000000790000004318000010010000,Mayflash GameCube Controller Adapter,a:b1,b:b2,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b7,righttrigger:a4,rightx:a5,righty:a2,start:b9,x:b0,y:b3,platform:Linux,",

  "0300a81c5e040000a102000000010000,Xbox 360 Controller,a:b0,b:b1,back:b6,dpdown:b12,dpleft:b13,dpright:b14,dpup:b11,guide:b8,leftshoulder:b4,leftstick:b9,lefttrigger:a2,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b10,righttrigger:a5,rightx:a3,righty:a4,start:b7,x:b2,y:b3,platform:Linux,",
];

const fetchSdlMappings = () => {
  fetch(url).then((result) => {
    result.text().then((text) => {
      const mappings = text
        .split("\n")
        .filter((line) => line && !line.startsWith("#"));

      const mappingsFiltered = [
        ...filterMappings(mappings, overwrites),
        ...overwrites,
      ];

      writeFile(mappingsFiltered, nodepath.join(resultPath, "mappings.json"));

      const absoluteGamecontrollerdbPath = nodepath.join(
        projectPath,
        gamecontrollerdbPath,
      );
      mkdirSync(nodepath.dirname(absoluteGamecontrollerdbPath), {
        recursive: true,
      });
      writeFileSync(absoluteGamecontrollerdbPath, mappingsFiltered.join("\n"));
    });
  });
};

fetchSdlMappings();
