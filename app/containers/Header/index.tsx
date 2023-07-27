import { styled } from "../../../styled-system/jsx";

const Headline = styled("h1", {
  base: {
    margin: 0,
    padding: 0,
    fontWeight: 400,
    fontSize: "2rem",
  },
});

const StyledHeader = styled("header", {
  base: {
    marginBottom: "-0.8em",
  },
});

export const Header = () => (
  <StyledHeader>
    <Headline>emuze</Headline>
  </StyledHeader>
);
