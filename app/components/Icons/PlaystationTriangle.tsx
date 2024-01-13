import * as React from "react";
import type { SVGProps } from "react";
import type { SVGRProps } from "~/types/svgProps";
const SvgPlaystationTriangle = ({
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
    <path d="m256 216.44-43.85 73.34h87.7L256 216.44z" />
    <path d="M256 103.51c-84.08 0-152.49 68.41-152.49 152.49S171.92 408.49 256 408.49 408.49 340.08 408.49 256 340.08 103.51 256 103.51Zm-96.74 216.27L256 158l96.74 161.81Z" />
  </svg>
);
SvgPlaystationTriangle.displayName = "SvgPlaystationTriangle";
export default SvgPlaystationTriangle;
