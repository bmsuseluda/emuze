import { styled } from "~/stitches";

const Headline = styled("h1", {
  margin: 0,
  padding: 0,
  fontWeight: 400,
  fontSize: "2rem",
});

const StyledHeader = styled("header", {
  marginBottom: "-0.8em",
});

export const Header = () => (
  <StyledHeader>
    <Headline>emuze</Headline>
  </StyledHeader>
);
