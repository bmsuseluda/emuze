import { styled } from "~/stitches";
import { Link as RemixLink } from "@remix-run/react";
import type { AnchorHTMLAttributes } from "react";
import React from "react";
import { VscSettingsGear } from "react-icons/vsc";
import type { RemixLinkProps } from "@remix-run/react/dist/components";

const Link = styled(RemixLink, {
  position: "fixed",
  top: 0,
  right: "140px",

  margin: 0,
  padding: "$1 15px",
  lineHeight: "16px",
  blockSize: "16px",
  backgroundColor: "transparent",
  border: "none",
  color: "$color",
  boxSizing: "content-box",
  cursor: "inherit",

  "& svg": {
    width: "16px",
    height: "16px",
  },

  "&:hover": {
    backgroundColor: "#3d3c40b3",
  },

  variants: {
    isFullscreen: {
      true: {
        top: 0,
        right: 0,
      },
    },
  },
});

type Props = {
  isFullscreen?: boolean;
  to?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<RemixLinkProps, "to">;

export const SettingsLink = React.forwardRef<HTMLAnchorElement, Props>(
  ({ isFullscreen = false, to = "settings", ...rest }, ref) => (
    <Link
      {...rest}
      to={to}
      aria-label="Settings"
      title="Settings"
      prefetch="intent"
      draggable={false}
      isFullscreen={isFullscreen}
      ref={ref}
    >
      <VscSettingsGear />
    </Link>
  )
);

SettingsLink.displayName = "SettingsLink";
