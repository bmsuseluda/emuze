import * as React from "react";
import type { SVGProps } from "react";
import type { SVGRProps } from "~/types/svgProps";
const SvgGba = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 15 15"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={0}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.719 2.42A2.5 2.5 0 0 1 5.106 2h4.789a2.5 2.5 0 0 1 1.386.42l.87.58a2.5 2.5 0 0 1 2.48 2.322l.32 4.476a1.5 1.5 0 0 1-.825 1.448l-2.09 1.045a3.68 3.68 0 0 1-.753.279c-2.484.62-5.082.62-7.566 0a3.68 3.68 0 0 1-.753-.279l-2.09-1.045A1.5 1.5 0 0 1 .05 9.798l.32-4.476A2.5 2.5 0 0 1 2.849 3l.87-.58ZM3 8V7H2V6h1V5h1v1h1v1H4v1H3Zm10-1h-1V6h1v1Zm-2 2h1V8h-1v1Z"
      clipRule="evenodd"
    />
  </svg>
);
SvgGba.displayName = "SvgGba";
export default SvgGba;
