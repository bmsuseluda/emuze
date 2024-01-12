import * as React from "react";
import type { SVGProps } from "react";
import type { SVGRProps } from "~/types/svgProps";
const SvgXboxx = ({
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
    <path d="M256 103.51c-84.08 0-152.49 68.41-152.49 152.49S171.92 408.49 256 408.49 408.49 340.08 408.49 256 340.08 103.51 256 103.51Zm72.6 241.23h-34l-38.35-59.93-38.59 59.93H183.4l55.93-82.58-57.76-84.94h34.25l40.41 62.29 40.18-62.29h34l-57.76 84.94Z" />
  </svg>
);
SvgXboxx.displayName = "SvgXboxx";
export default SvgXboxx;
