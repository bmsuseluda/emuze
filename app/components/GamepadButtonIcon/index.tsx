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
import type { ButtonId, GamepadType } from "../../types/gamepad.js";

interface IconMappingProps extends SVGProps<SVGSVGElement>, SVGRProps {}

const iconMapping: Record<
  GamepadType,
  Partial<Record<ButtonId, (props: IconMappingProps) => ReactNode>>
> = {
  PlayStation: {
    a: PlaystationCross,
    b: PlaystationCircle,
    x: PlaystationSquare,
    y: PlaystationTriangle,
  },
  Nintendo: {
    a: Xboxa,
    b: Xboxb,
    x: Xboxx,
    y: Xboxy,
  },
  XBox: {
    a: Xboxa,
    b: Xboxb,
    x: Xboxx,
    y: Xboxy,
  },
};

interface Props {
  buttonId: ButtonId;
  gamepadType?: GamepadType;
}

export const GamepadButtonIcon = ({
  buttonId: buttonIndex,
  gamepadType = "XBox",
}: Props) => {
  const Icon = iconMapping[gamepadType][buttonIndex];

  return Icon ? <Icon /> : null;
};
