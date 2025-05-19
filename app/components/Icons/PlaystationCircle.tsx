import type { SVGProps } from "react";
import * as React from "react";
import type { SVGRProps } from "../../types/svgProps.js";

const SvgPlaystationCircle = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    data-name="Layer 1"
    viewBox="103.51 103.51 304.98 304.98"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={0}
    width="1em"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M256 200.37A55.63 55.63 0 1 0 311.63 256 55.69 55.69 0 0 0 256 200.37Z" />
    <path d="M256 103.51c-84.08 0-152.49 68.41-152.49 152.49S171.92 408.49 256 408.49 408.49 340.08 408.49 256 340.08 103.51 256 103.51Zm0 239.33A86.84 86.84 0 1 1 342.84 256 86.94 86.94 0 0 1 256 342.84Z" />
  </svg>
);
SvgPlaystationCircle.displayName = "SvgPlaystationCircle";
export default SvgPlaystationCircle;
