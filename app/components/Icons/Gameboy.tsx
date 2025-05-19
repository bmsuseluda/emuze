import type { SVGProps } from "react";
import * as React from "react";
import type { SVGRProps } from "../../types/svgProps.js";

const SvgGameboy = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlSpace="preserve"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 519.465 519.465"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={0}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M118.917 519.465h281.63c16.897 0 30.6-13.701 30.6-30.6V30.6c0-16.897-13.702-30.6-30.6-30.6h-281.63c-16.903 0-30.6 13.703-30.6 30.6v458.265c0 16.905 13.697 30.6 30.6 30.6zm120.448-125.82a5.768 5.768 0 0 1-5.765 5.771h-33.458v33.457a5.768 5.768 0 0 1-5.765 5.771h-19.614a5.77 5.77 0 0 1-5.771-5.771v-33.457h-33.458a5.764 5.764 0 0 1-5.765-5.771V374.03a5.768 5.768 0 0 1 5.765-5.77h33.458v-33.459a5.77 5.77 0 0 1 5.771-5.771h19.614a5.764 5.764 0 0 1 5.765 5.771v33.459H233.6a5.764 5.764 0 0 1 5.765 5.77v19.615zm77.712 40.501c-13.696 0-24.799-11.102-24.799-24.799 0-13.695 11.102-24.797 24.799-24.797 13.696 0 24.798 11.102 24.798 24.797 0 13.692-11.107 24.799-24.798 24.799zm78.531-78.531c0 13.695-11.102 24.799-24.798 24.799s-24.798-11.104-24.798-24.799c0-13.697 11.102-24.799 24.798-24.799s24.798 11.102 24.798 24.799zM127.357 45.533h259.377v228.479H127.357V45.533z" />
  </svg>
);
SvgGameboy.displayName = "SvgGameboy";
export default SvgGameboy;
