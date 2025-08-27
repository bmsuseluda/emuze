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
import { BsXbox } from "react-icons/bs";

export const icons: Record<SystemId, IconType> = {
  lastPlayed: AiFillClockCircle,
  nintendoentertainmentsystem: MdVideogameAsset,
  supernintendo: FaGamepad,
  nintendo64: SvgNintendo64,
  nintendogameboy: SvgGameboy,
  nintendogameboycolor: SvgGameboy,
  nintendogameboyadvance: SvgGba,
  nintendogamecube: SiNintendogamecube,
  nintendowii: SiWii,
  nintendowiiu: SiWiiu,
  nintendoswitch: SiNintendoswitch,
  nintendods: SiNintendo3Ds,
  nintendo3ds: SiNintendo3Ds,
  sonyplaystation: IoLogoPlaystation,
  sonyplaystation2: IoLogoPlaystation,
  sonyplaystation3: IoLogoPlaystation,
  sonypsp: SvgPsp,
  arcade: SiApplearcade,
  neogeo: SiApplearcade,
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
  segamastersystem: SiSega,
  segagamegear: Gamegear,
  segamegadrive: SiSega,
  sega32x: SiSega,
  segacd: SiSega,
  segamegald: SiSega,
  segasaturn: SiSega,
  xbox: BsXbox,
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
