import type { IconType } from "react-icons";
import { GiUpgrade } from "react-icons/gi";
import { FaToolbox } from "react-icons/fa";
import { BiSolidLayerPlus } from "react-icons/bi";
import { SystemSettingsId } from "../../types/jsonFiles/settings/advanced.js";

export const icons = {
  resolution: GiUpgrade,
  emulator: FaToolbox,
  shader: BiSolidLayerPlus,
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
