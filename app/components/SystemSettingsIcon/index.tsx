import type { IconType } from "react-icons";
import { GiUpgrade } from "react-icons/gi";
import { FaToolbox } from "react-icons/fa";
import { TbPerspective } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { BiSolidLayerPlus } from "react-icons/bi";
import { MdAccessTime } from "react-icons/md";
import { SystemSettingsId } from "../../types/jsonFiles/settings/advanced.js";

export const icons = {
  resolution: GiUpgrade,
  emulator: FaToolbox,
  shader: BiSolidLayerPlus,
  perspectiveCorrection: TbPerspective,
  ntscTimings: MdAccessTime,
  screenLayout: LuLayoutDashboard,
} satisfies Record<SystemSettingsId, IconType>;

interface Props {
  id: keyof typeof icons;
}

export const SystemSettingsIcon = ({ id }: Props) => {
  const Icon = icons[id];

  if (Icon) {
    return <Icon />;
  }

  return null;
};
