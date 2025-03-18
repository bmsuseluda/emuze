import { styled } from "../../../styled-system/jsx";
import logo from "../../../artwork/logo.svg";

export const Image = styled("img", {
  base: {
    aspectRatio: "auto",
    width: "45%",
    minWidth: "200px",
  },
});

export const Logo = () => <Image src={logo} alt="logo" />;
