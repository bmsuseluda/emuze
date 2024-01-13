import * as React from "react";
import type { SVGProps } from "react";
import type { SVGRProps } from "~/types/svgProps";
const SvgPlaystationSquare = ({
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
    <path d="M208.77 209.56h94.45v92.88h-94.45z" />
    <path d="M256 103.51c-84.08 0-152.49 68.41-152.49 152.49S171.92 408.49 256 408.49 408.49 340.08 408.49 256 340.08 103.51 256 103.51Zm77.23 228.93H178.77V179.56h154.46Z" />
  </svg>
);
SvgPlaystationSquare.displayName = "SvgPlaystationSquare";
export default SvgPlaystationSquare;
