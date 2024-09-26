import type { IconType } from "react-icons";
import { FaPaintBrush } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
import type { SettingsID } from "../../server/settings.server";

export const icons = {
  general: GiSettingsKnobs,
  appearance: FaPaintBrush,
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
