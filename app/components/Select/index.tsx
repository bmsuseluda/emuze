import { SelectHTMLAttributes } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { styled } from "~/stitches";

const Wrapper = styled("div", {
  position: "relative",
  minWidth: "200px",
  "&:focus, &:hover": {
    "> select": {
      border: "1px solid $color",
    },
  },
});

const DefaultSelect = styled("select", {
  border: "1px solid $backgroundColor",
  backgroundColor: "$sidebarBackgroundColor",
  color: "$color",
  padding: "$2 $4 $2 $2",
  borderRadius: "$1",
  outline: "none",
  "-webkit-appearance": "none",
  "-moz-appearance": "none",
  appearance: "none",
  cursor: "pointer",
  width: "100%",
});

const Arrow = styled(IoIosArrowDown, {
  position: "absolute",
  right: "$2",
  width: "30px",
  height: "30px",
  color: "$color",
  top: 0,
  bottom: 0,
  marginTop: "auto",
  marginBottom: "auto",
  cursor: "pointer",
});

export const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => (
  <Wrapper>
    <DefaultSelect {...props} />
    <Arrow />
  </Wrapper>
);
