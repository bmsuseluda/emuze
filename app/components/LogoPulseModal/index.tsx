import { styled } from "../../../styled-system/jsx";
import logo from "../../../artwork/logoPlain.svg";

const Overlay = styled("div", {
  base: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    position: "fixed",
    inset: 0,
    animation: "makeOpaque 150ms",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  variants: {
    active: {
      false: {
        display: "none",
      },
    },
  },
});

const Logo = styled("img", {
  base: {
    aspectRatio: "auto",
    width: "12em",
    animation: "pulse 2s cubic-bezier(.45,.05,.55,.95) infinite",
  },
});

interface Props {
  active: boolean;
}

export const LogoPulseModal = ({ active }: Props) => (
  <Overlay active={active}>
    <Logo src={logo} alt="Logo pulse animation" />
  </Overlay>
);
