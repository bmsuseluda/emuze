import type { IconType } from "react-icons";
import { FaPaintBrush } from "react-icons/fa";
import { GoSettings } from "react-icons/go";

const icons: Record<string, IconType> = {
  general: GoSettings,
  appearance: FaPaintBrush,
};

type Props = {
  id: keyof typeof icons;
};

// TODO: add story with all icons
export const SettingsIcon = ({ id }: Props) => {
  const Icon = icons[id];

  if (Icon) {
    return <Icon />;
  }

  return null;
};
