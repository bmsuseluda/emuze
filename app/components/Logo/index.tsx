import { styled } from "../../../styled-system/jsx/index.js";
import logo from "../../../artwork/logoPlain.svg";

export const Image = styled("img", {
  base: {
    aspectRatio: "auto",
    width: "45%",
    minWidth: "200px",
  },
});

export const Logo = () => <Image src={logo} alt="logo" />;
