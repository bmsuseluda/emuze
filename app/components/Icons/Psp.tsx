import type { SVGProps } from "react";
import * as React from "react";
import type { SVGRProps } from "../../types/svgProps.js";

const SvgPsp = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlSpace="preserve"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 47.45 47.449"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={0}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M40.323 22.859h2.1v2.098h-2.1z" />
    <path d="M37.469 13.741H9.827v.008C4.387 13.833 0 18.263 0 23.724c0 5.46 4.387 9.891 9.826 9.976v.008h27.643c5.514-.001 9.98-4.47 9.98-9.983s-4.466-9.983-9.98-9.984zm-27.36 9.928v.848H7.571v2.539H6.397v-2.539H3.859v-.959H6.397v-2.623H7.571v2.623h2.538v.111zm26.212 8.166H12.698V15.306h23.623v16.529zm8.197-6.879H42.42v2.1h-2.1v-2.1h-2.096v-2.098h2.096V20.76h2.1v2.098h2.098v2.098z" />
  </svg>
);
SvgPsp.displayName = "SvgPsp";
export default SvgPsp;
