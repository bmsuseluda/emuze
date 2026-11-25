import { Link as RemixLink } from "react-router";
import type { LinkProps } from "react-router";
import { VscSettingsGear } from "react-icons/vsc";
import { styled } from "../../../styled-system/jsx/factory.js";

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
});

interface Props extends Omit<LinkProps, "to"> {
  to?: string;
  visible?: boolean;
}

export const SettingsLink = ({
  to = "settings",
  visible = true,
  ...rest
}: Props) => (
  <>
    <Link
      {...rest}
      to={to}
      aria-label="Settings"
      title="Settings"
      prefetch="render"
      draggable={false}
      style={{ display: visible ? "block" : "none" }}
    >
      <VscSettingsGear />
    </Link>
    <Link
      {...rest}
      id="openSettingsGeneral"
      to="settings/general"
      aria-label="Settings"
      title="Settings"
      prefetch="render"
      draggable={false}
      style={{ display: "none" }}
    >
      <VscSettingsGear />
    </Link>
    <Link
      {...rest}
      id="openSettingsAdvanced"
      to="settings/advanced"
      aria-label="Settings"
      title="Settings"
      prefetch="render"
      draggable={false}
      style={{ display: "none" }}
    >
      <VscSettingsGear />
    </Link>
  </>
);
