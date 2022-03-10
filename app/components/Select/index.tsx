import { SelectHTMLAttributes } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { styled } from "~/stitches";

const Wrapper = styled("div", {
  position: "relative",
  width: "100%",
  "&:focus": {
    "> select": {
      borderColor: "$color",
    },
  },
});

const DefaultSelect = styled("select", {
  backgroundColor: "$sidebarBackgroundColor",
  color: "$color",
  padding: "$1 $3 $1 $1",
  borderStyle: "solid",
  borderWidth: "$2",
  borderColor: "$backgroundColor",
  borderRadius: "$1",
  outline: "none",
  "-webkit-appearance": "none",
  "-moz-appearance": "none",
  appearance: "none",
  cursor: "pointer",
  width: "100%",
  boxSizing: "border-box",
});

const Arrow = styled(IoIosArrowDown, {
  position: "absolute",
  right: "$1",
  width: "$2",
  height: "$2",
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
