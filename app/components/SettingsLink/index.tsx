import { Link as RemixLink } from "react-router";
import type { LinkProps } from "react-router";
import { VscSettingsGear } from "react-icons/vsc";
import { styled } from "../../../styled-system/jsx/index.js";

const Link = styled(RemixLink, {
  base: {
    position: "fixed",
    top: 0,
    right: "8.75rem",

    margin: 0,
    paddingTop: "1",
    paddingRight: "0.9375rem",
    paddingBottom: "1",
    paddingLeft: "0.9375rem",
    lineHeight: "1rem",
    blockSize: "1rem",
    backgroundColor: "transparent",
    border: "none",
    color: "color",
    boxSizing: "content-box",
    cursor: "inherit",

    "& svg": {
      width: "iconExtraSmall",
      height: "auto",
      verticalAlign: "middle",
      aspectRatio: 1,
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

interface Props extends Omit<LinkProps, "to"> {
  isFullscreen?: boolean;
  to?: string;
}

export const SettingsLink = ({
  isFullscreen = false,
  to = "settings",
  ...rest
}: Props) => (
  <Link
    {...rest}
    to={to}
    aria-label="Settings"
    title="Settings"
    prefetch="intent"
    draggable={false}
    isFullscreen={isFullscreen}
  >
    <VscSettingsGear />
  </Link>
);
