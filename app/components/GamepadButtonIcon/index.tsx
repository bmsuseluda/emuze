import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping";
import type { ReactNode, SVGProps } from "react";
import Xboxa from "../Icons/Xboxa";
import type { SVGRProps } from "../../types/svgProps";
import Xboxb from "../Icons/Xboxb";
import Xboxx from "../Icons/Xboxx";
import Xboxy from "../Icons/Xboxy";
import PlaystationCross from "../Icons/PlaystationCross";
import PlaystationCircle from "../Icons/PlaystationCircle";
import PlaystationSquare from "../Icons/PlaystationSquare";
import PlaystationTriangle from "../Icons/PlaystationTriangle";

interface IconMappingProps extends SVGProps<SVGSVGElement>, SVGRProps {}

const iconMapping: Record<
  GamepadType,
  ((props: IconMappingProps) => ReactNode)[]
> = {
  PlayStation: [
    PlaystationCross,
    PlaystationCircle,
    PlaystationSquare,
    PlaystationTriangle,
  ],
  Nintendo: [Xboxb, Xboxa, Xboxy, Xboxx],
  XBox: [Xboxa, Xboxb, Xboxx, Xboxy],
};

interface Props {
  buttonIndex: number;
  gamepadType?: GamepadType;
}

export const GamepadButtonIcon = ({
  buttonIndex,
  gamepadType = "XBox",
}: Props) => {
  const Icon = iconMapping[gamepadType][buttonIndex];

  return <Icon />;
};
