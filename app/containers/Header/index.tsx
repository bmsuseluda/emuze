import { styled } from "~/stitches";

const Headline = styled("h1", {
  margin: 0,
  padding: 0,
});

const StyledNav = styled("nav", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  variants: {
    collapse: {
      true: {
        display: "block",
      },
    },
  },
});

const StyledHeader = styled("header", {
  marginBottom: "-0.8em",
});

type Props = {
  collapse?: boolean;
};

export const Header = ({ collapse = false }: Props) => (
  <StyledHeader>
    <StyledNav aria-label="Main navigation" collapse={collapse}>
      {!collapse && <Headline>emuze</Headline>}
    </StyledNav>
  </StyledHeader>
);
