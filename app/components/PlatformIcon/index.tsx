import type { IconType } from "react-icons";
import { IoLogoPlaystation } from "react-icons/io";
import {
  SiApplearcade,
  SiNintendo3Ds,
  SiNintendogamecube,
  SiSega,
  SiWii,
} from "react-icons/si";
import { FaGamepad } from "react-icons/fa";
import { MdVideogameAsset } from "react-icons/md";
import { TiSpiral } from "react-icons/ti";
import type { PlatformId } from "~/server/categoriesDB.server";
import SvgGameboy from "~/components/Icons/Gameboy";
import SvgNintendo64 from "~/components/Icons/Nintendo64";
import SvgGba from "~/components/Icons/Gba";
import SvgPsp from "~/components/Icons/Psp";

const icons: Record<PlatformId, IconType> = {
  nintendoentertainmentsystem: MdVideogameAsset,
  supernintendo: FaGamepad,
  nintendo64: SvgNintendo64,
  nintendogameboy: SvgGameboy,
  nintendogameboycolor: SvgGameboy,
  nintendogameboyadvance: SvgGba,
  nintendogamecube: SiNintendogamecube,
  nintendowii: SiWii,
  nintendods: SiNintendo3Ds,
  nintendo3ds: SiNintendo3Ds,
  sonyplaystation: IoLogoPlaystation,
  sonyplaystation2: IoLogoPlaystation,
  sonypsp: SvgPsp,
  arcade: SiApplearcade,
  neogeo: SiApplearcade,
  neogeocd: SiApplearcade,
  segadreamcast: TiSpiral,

  // TODO: replace the following icons
  pcengine: MdVideogameAsset,
  pcenginecd: MdVideogameAsset,
  segamastersystem: SiSega,
  segagamegear: SiSega,
  segamegadrive: SiSega,
  sega32x: SiSega,
  segacd: SiSega,
  segasaturn: SiSega,
};

type Props = {
  id: keyof typeof icons;
};

// TODO: add story with all icons
export const PlatformIcon = ({ id }: Props) => {
  const Icon = icons[id];

  if (Icon) {
    return <Icon />;
  }

  return null;
};
