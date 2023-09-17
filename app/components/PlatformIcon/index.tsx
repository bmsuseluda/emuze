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

const icons: Record<PlatformId, IconType> = {
  nintendoentertainmentsystem: MdVideogameAsset,
  supernintendo: FaGamepad,
  nintendogamecube: SiNintendogamecube,
  nintendowii: SiWii,
  nintendods: SiNintendo3Ds,
  nintendo3ds: SiNintendo3Ds,
  sonyplaystation: IoLogoPlaystation,
  sonyplaystation2: IoLogoPlaystation,
  sonypsp: IoLogoPlaystation,
  arcade: SiApplearcade,
  neogeo: SiApplearcade,
  neogeocd: SiApplearcade,
  segamastersystem: SiSega,
  segamegadrive: SiSega,
  sega32x: SiSega,
  segacd: SiSega,
  segasaturn: SiSega,
  segadreamcast: TiSpiral,

  // TODO: replace the following icons
  nintendo64: MdVideogameAsset,
  nintendogameboy: MdVideogameAsset,
  nintendogameboycolor: MdVideogameAsset,
  nintendogameboyadvance: MdVideogameAsset,
  pcengine: MdVideogameAsset,
  pcenginecd: MdVideogameAsset,
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
