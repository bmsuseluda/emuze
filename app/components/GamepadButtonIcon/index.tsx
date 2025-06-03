import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping.js";
import type { ReactNode, SVGProps } from "react";
import Xboxa from "../Icons/Xboxa.js";
import type { SVGRProps } from "../../types/svgProps.js";
import Xboxb from "../Icons/Xboxb.js";
import Xboxx from "../Icons/Xboxx.js";
import Xboxy from "../Icons/Xboxy.js";
import PlaystationCross from "../Icons/PlaystationCross.js";
import PlaystationCircle from "../Icons/PlaystationCircle.js";
import PlaystationSquare from "../Icons/PlaystationSquare.js";
import PlaystationTriangle from "../Icons/PlaystationTriangle.js";

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
