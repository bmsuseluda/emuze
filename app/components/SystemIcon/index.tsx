import type { IconType } from "react-icons";
import { IoLogoPlaystation } from "react-icons/io";
import {
  SiApplearcade,
  SiNintendo3Ds,
  SiNintendogamecube,
  SiNintendoswitch,
  SiSega,
  SiWii,
  SiWiiu,
} from "react-icons/si";
import { FaGamepad } from "react-icons/fa";
import { MdVideogameAsset } from "react-icons/md";
import { TiSpiral } from "react-icons/ti";
import { GrDos } from "react-icons/gr";
import { LuComputer } from "react-icons/lu";
import SvgGameboy from "../Icons/Gameboy.js";
import SvgNintendo64 from "../Icons/Nintendo64.js";
import SvgGba from "../Icons/Gba.js";
import SvgPsp from "../Icons/Psp.js";
import Gamegear from "../Icons/Gamegear.js";
import Neogeopocket from "../Icons/Neogeopocket.js";
import type { SystemId } from "../../server/categoriesDB.server/systemId.js";
import { AiFillClockCircle } from "react-icons/ai";

export const icons: Record<SystemId, IconType> = {
  lastPlayed: AiFillClockCircle,
  // TODO: use https://thenounproject.com/icon/game-controller-193591/
  nintendoentertainmentsystem: MdVideogameAsset,
  supernintendo: FaGamepad,
  // TODO: use https://thenounproject.com/icon/game-controller-193588/
  nintendo64: SvgNintendo64,
  nintendogameboy: SvgGameboy,
  nintendogameboycolor: SvgGameboy,
  nintendogameboyadvance: SvgGba,
  nintendogamecube: SiNintendogamecube,
  nintendowii: SiWii,
  nintendowiiu: SiWiiu,
  nintendoswitch: SiNintendoswitch,
  // TODO: use seperate
  nintendods: SiNintendo3Ds,
  nintendo3ds: SiNintendo3Ds,
  sonyplaystation: IoLogoPlaystation,
  sonyplaystation2: IoLogoPlaystation,
  sonyplaystation3: IoLogoPlaystation,
  sonypsp: SvgPsp,
  arcade: SiApplearcade,
  neogeo: SiApplearcade,
  // TODO: use https://thenounproject.com/icon/neo-geo-221035/
  neogeocd: SiApplearcade,
  neogeopocket: Neogeopocket,
  neogeopocketcolor: Neogeopocket,
  segadreamcast: TiSpiral,
  dos: GrDos,
  scumm: LuComputer,

  // TODO: replace the following icons
  pcengine: MdVideogameAsset,
  pcenginecd: MdVideogameAsset,
  pcenginesupergrafx: MdVideogameAsset,
  // TODO: use https://thenounproject.com/icon/game-controller-193791/
  segamastersystem: SiSega,
  // TODO: use https://thenounproject.com/icon/sega-gamegear-206897/
  segagamegear: Gamegear,
  // TODO: use https://thenounproject.com/icon/game-controller-193792/
  segamegadrive: SiSega,
  // TODO: use https://thenounproject.com/icon/game-controller-193792/
  sega32x: SiSega,
  // TODO: use https://thenounproject.com/icon/game-controller-193792/
  segacd: SiSega,
  // TODO: use https://thenounproject.com/icon/game-controller-193793/
  segasaturn: SiSega,
};

interface Props {
  id: keyof typeof icons;
}

export const SystemIcon = ({ id }: Props) => {
  const Icon = icons[id];

  if (Icon) {
    return <Icon />;
  }

  return null;
};
