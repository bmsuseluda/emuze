import * as React from "react";
import type { SVGProps } from "react";
import type { SVGRProps } from "~/types/svgProps";
const SvgXboxy = ({
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
    <path d="M256 103.51c-84.08 0-152.49 68.41-152.49 152.49S171.92 408.49 256 408.49 408.49 340.08 408.49 256 340.08 103.51 256 103.51Zm16.24 188v61.21h-32.72V291l-61.38-113.49H214l41.79 84.41 42.51-84.41h35.59Z" />
  </svg>
);
SvgXboxy.displayName = "SvgXboxy";
export default SvgXboxy;
