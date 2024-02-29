import type { IconType } from "react-icons";
import { FaPaintBrush } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import type { SettingsID } from "~/server/settings.server";

export const icons = {
  general: VscSettings,
  appearance: FaPaintBrush,
} satisfies Record<SettingsID, IconType>;

type Props = {
  id: keyof typeof icons;
};

export const SettingsIcon = ({ id }: Props) => {
  const Icon = icons[id];

  if (Icon) {
    return <Icon />;
  }

  return null;
};
