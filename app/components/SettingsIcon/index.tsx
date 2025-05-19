import type { IconType } from "react-icons";
import { FaPaintBrush } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
import { IoHomeSharp } from "react-icons/io5";
import type { SettingsID } from "../../server/settings.server.js";

export const icons = {
  general: GiSettingsKnobs,
  appearance: FaPaintBrush,
  about: IoHomeSharp,
} satisfies Record<SettingsID, IconType>;

interface Props {
  id: keyof typeof icons;
}

export const SettingsIcon = ({ id }: Props) => {
  const Icon = icons[id];

  if (Icon) {
    return <Icon />;
  }

  return null;
};
