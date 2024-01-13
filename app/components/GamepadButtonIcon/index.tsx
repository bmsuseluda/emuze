import type { GamepadType } from "~/hooks/useGamepads/gamepadTypeMapping";
import type { ReactNode, SVGProps } from "react";
import Xboxa from "~/components/Icons/Xboxa";
import type { SVGRProps } from "~/types/svgProps";
import Xboxb from "~/components/Icons/Xboxb";
import Xboxx from "~/components/Icons/Xboxx";
import Xboxy from "~/components/Icons/Xboxy";
import PlaystationCross from "~/components/Icons/PlaystationCross";
import PlaystationCircle from "~/components/Icons/PlaystationCircle";
import PlaystationSquare from "~/components/Icons/PlaystationSquare";
import PlaystationTriangle from "~/components/Icons/PlaystationTriangle";

const iconMapping: Record<
  GamepadType,
  ((props: SVGProps<SVGSVGElement> & SVGRProps) => ReactNode)[]
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

type Props = {
  buttonIndex: number;
  gamepadType: GamepadType;
};

export const GamepadButtonIcon = ({ buttonIndex, gamepadType }: Props) => {
  const Icon = iconMapping[gamepadType][buttonIndex];

  return <Icon />;
};
