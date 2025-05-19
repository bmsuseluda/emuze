import type { SVGProps } from "react";
import * as React from "react";
import type { SVGRProps } from "../../types/svgProps.js";

const SvgXboxa = ({
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
    <path d="M231.76 267.42h47.76l-23.4-68.86-24.36 68.86z" />
    <path d="M256 103.51c-84.08 0-152.49 68.41-152.49 152.49S171.92 408.49 256 408.49 408.49 340.08 408.49 256 340.08 103.51 256 103.51Zm44.35 229.79-15.45-42.82h-58l-15.25 42.82h-33.24l63.43-171.73h28.55l63.2 171.73Z" />
  </svg>
);
SvgXboxa.displayName = "SvgXboxa";
export default SvgXboxa;
