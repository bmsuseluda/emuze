import type { SVGProps } from "react";
import * as React from "react";
import type { SVGRProps } from "../../types/svgProps";

const SvgNeogeopocket = ({
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
      d="M43.283 24.687c-9.727-.005-21.47.103-37.068.429-2.761.057-5 2.347-5 5.108v32.107c0 2.761 2.224 5.252 4.97 5.535 26.507 2.727 48.653 2.784 77.489-.03 2.748-.268 4.974-2.744 4.974-5.505V30.224c0-2.761-2.239-5.017-5-5.049-13.539-.158-24.153-.48-40.365-.488zm-19.822 4.242H66.01v33.526H23.46V28.93zm57.871 9.798a3.55 2.986 0 0 1 3.55 2.987 3.55 2.986 0 0 1-3.55 2.985 3.55 2.986 0 0 1-3.549-2.985 3.55 2.986 0 0 1 3.549-2.987zm-69.357.926a7.203 6.06 0 0 1 7.203 6.062 7.203 6.06 0 0 1-7.203 6.06 7.203 6.06 0 0 1-7.204-6.06 7.203 6.06 0 0 1 7.204-6.062zm62.634 6.052a3.55 2.986 0 0 1 3.551 2.985 3.55 2.986 0 0 1-3.55 2.987 3.55 2.986 0 0 1-3.55-2.987 3.55 2.986 0 0 1 3.55-2.985z"
      clipRule="evenodd"
    />
  </svg>
);
SvgNeogeopocket.displayName = "SvgNeogeopocket";
export default SvgNeogeopocket;
