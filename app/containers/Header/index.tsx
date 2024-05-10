import { styled } from "../../../styled-system/jsx";
import icon from "../../../artwork/icon.svg";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "1",
  },
  variants: {
    collapse: {
      true: {
        paddingTop: "0.3em",
      },
    },
  },
});

const StyledHeader = styled("header", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    paddingLeft: "0.2rem",

    "& > img": {
      maxHeight: "3em",
      maxWidth: "3em",
      minHeight: "2.2em",
      minWidth: "2.2em",
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
    fontSize: "4rem",
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
  <Wrapper collapse={collapse}>
    <StyledHeader>
      <img src={icon} alt="icon" />
      {!collapse && <Headline>emuze</Headline>}
    </StyledHeader>
  </Wrapper>
);
