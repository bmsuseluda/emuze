import { Link as RemixLink } from "@remix-run/react";
import type { ElementRef } from "react";
import { forwardRef } from "react";
import { VscSettingsGear } from "react-icons/vsc";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import { styled } from "../../../styled-system/jsx";

const Link = styled(RemixLink, {
  base: {
    position: "fixed",
    top: 0,
    right: "140px",

    margin: 0,
    paddingTop: "1",
    paddingRight: "15px",
    paddingBottom: "1",
    paddingLeft: "15px",
    lineHeight: "16px",
    blockSize: "16px",
    backgroundColor: "transparent",
    border: "none",
    color: "color",
    boxSizing: "content-box",
    cursor: "inherit",

    "& svg": {
      width: "16px",
      height: "16px",
    },

    "&:hover": {
      backgroundColor: "#3d3c40b3",
    },
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

interface Props extends Omit<RemixLinkProps, "to"> {
  isFullscreen?: boolean;
  to?: string;
}

export const SettingsLink = forwardRef<ElementRef<typeof Link>, Props>(
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
  ),
);

SettingsLink.displayName = "SettingsLink";
