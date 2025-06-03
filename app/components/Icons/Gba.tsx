import type { SVGProps } from "react";
import * as React from "react";
import type { SVGRProps } from "../../types/svgProps.js";

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
      d="M2.173 5.586v.989l-.989.007.007 1.02.982-.006v.981h1.02V7.59l.99-.007-.008-1.022-.981.007v-.981Zm10.337.131h.943v.944h-.943zM11.267 6.87h.944v.943h-.944ZM5.042 4.97h5.253v5.18H5.042ZM3.719 2.683a2.5 2.5 0 0 1 1.387-.42h4.788a2.5 2.5 0 0 1 1.387.42l.87.58a2.5 2.5 0 0 1 2.48 2.322l.32 3.989a1.5 1.5 0 0 1-.825 1.448l-2.09 1.045c-.24.12-.493.139-.753.204-2.484.62-5.082.62-7.566 0-.26-.065-.513-.084-.753-.204l-2.09-1.045A1.5 1.5 0 0 1 .05 9.574l.32-3.989a2.509 2.509 0 0 1 2.48-2.321Z"
      clipRule="evenodd"
    />
  </svg>
);
SvgGba.displayName = "SvgGba";
export default SvgGba;
