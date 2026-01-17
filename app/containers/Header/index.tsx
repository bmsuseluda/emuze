import { styled } from "../../../styled-system/jsx/index.js";
import icon from "../../../artwork/icon.svg";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "1",
  },
});

const StyledHeader = styled("header", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",

    "& > img": {
      aspectRatio: "auto",
      width: "3.2rem",
    },
  },
});

export const Headline = styled("h1", {
  base: {
    display: "inline",
    color: "color",
    margin: 0,
    padding: 0,
    fontWeight: 400,
    fontSize: "extraLarge",
    fontFamily: "annieUseYourTelescope",
    whiteSpace: "nowrap",

    _before: {
      content: '""',
      marginBottom: "-0.55em",
      display: "table",
    },
    _after: {
      content: '""',
      marginTop: "-0.4em",
      display: "table",
    },
  },
});

interface Props {
  collapse?: boolean;
}

export const Header = ({ collapse }: Props) => (
  <Wrapper>
    <StyledHeader>
      <img src={icon} alt="icon" />
      {!collapse && <Headline>emuze</Headline>}
    </StyledHeader>
  </Wrapper>
);
