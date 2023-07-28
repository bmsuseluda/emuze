import { IconButton } from "./components/IconButton";
import { styled } from "../../../styled-system/jsx";

const Wrapper = styled("div", {
  base: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "25px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
});

const Draggable = styled("div", {
  base: {
    width: "100%",
    height: "100%",
  },
});

const Buttons = styled("div", {
  base: {
    display: "flex",
    whiteSpace: "nowrap",
  },
});

const FakeSettingsButton = styled("div", {
  base: {
    width: "16px",
    height: "16px",
    padding: "12.8px 15px",
  },
});

export const Titlebar = () => (
  <Wrapper>
    <Draggable className="draggable" />
    <Buttons>
      <FakeSettingsButton />
      <IconButton variant="minimize" />
      <IconButton variant="maximize" />
      <IconButton variant="close" />
    </Buttons>
  </Wrapper>
);
