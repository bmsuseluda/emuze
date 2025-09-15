import type { Application } from "../app/server/applicationsDB.server/types.js";
import { scummvm } from "../app/server/applicationsDB.server/applications/scummvm/index.js";
import { dosboxstaging } from "../app/server/applicationsDB.server/applications/dosbox/index.js";
import { mame } from "../app/server/applicationsDB.server/applications/mame/index.js";
import { rpcs3 } from "../app/server/applicationsDB.server/applications/rpcs3/index.js";
import { ares } from "../app/server/applicationsDB.server/applications/ares/index.js";
import { duckstation } from "../app/server/applicationsDB.server/applications/duckstation/index.js";
import { pcsx2 } from "../app/server/applicationsDB.server/applications/pcsx2/index.js";
import { ryujinx } from "../app/server/applicationsDB.server/applications/ryujinx/index.js";
import { dolphin } from "../app/server/applicationsDB.server/applications/dolphin/index.js";
import { mednafen } from "../app/server/applicationsDB.server/applications/mednafen/index.js";
import { azahar } from "../app/server/applicationsDB.server/applications/azahar/index.js";
import { ppsspp } from "../app/server/applicationsDB.server/applications/ppsspp/index.js";
import { flycast } from "../app/server/applicationsDB.server/applications/flycast/index.js";
import { xemu } from "../app/server/applicationsDB.server/applications/xemu/index.js";
import { melonds } from "../app/server/applicationsDB.server/applications/melonds/index.js";
import { cemu } from "../app/server/applicationsDB.server/applications/cemu/index.js";

export const applications = {
  duckstation,
  pcsx2,
  rpcs3,
  ppsspp,
  azahar,
  melonds,
  dolphin,
  ryujinx,
  cemu,
  mednafen,
  mame,
  ares,
  flycast,
  dosboxstaging,
  scummvm,
  xemu,
} satisfies Record<string, Application>;
