import type { SVGProps } from "react";
import * as React from "react";
import type { SVGRProps } from "../../types/svgProps.js";

const SvgGamegear = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 90 90"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={0}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M9.017 33.69v4.484H4.532v5.039h4.485v4.484h5.037v-4.484h4.484v-5.04h-4.484V33.69Zm14.685-5.804h44.304v26.858H23.702ZM89.8 45.7c-.5-10.1-2.5-19.4-2.5-19.4-.3-2-1.3-3-3.2-3.4 0 0-17-2.4-39.1-2.4S5.9 22.9 5.9 22.9c-2 .3-2.9 1.4-3.2 3.4 0 0-2 9.3-2.5 19.4-.6 10.1.4 15.6.4 15.6.5 2.9 3.2 6 6.9 6.5 0 0 22.1 1.7 37.5 1.7 15.4 0 37.5-1.7 37.5-1.7 3.8-.5 6.4-3.6 6.9-6.5 0 0 1-5.5.4-15.6zM77.3 45c-1.5 0-2.7-1.2-2.7-2.7 0-1.5 1.2-2.7 2.7-2.7 1.5 0 2.7 1.2 2.7 2.7 0 1.5-1.3 2.7-2.7 2.7zm6.2-5.2c-1.5 0-2.7-1.2-2.7-2.7 0-1.5 1.2-2.7 2.7-2.7 1.5 0 2.7 1.2 2.7 2.7 0 1.5-1.2 2.7-2.7 2.7z"
      clipRule="evenodd"
    />
  </svg>
);
SvgGamegear.displayName = "SvgGamegear";
export default SvgGamegear;
