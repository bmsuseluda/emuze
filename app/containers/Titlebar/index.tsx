import {IconButton} from "./components/IconButton/index.js";
import {styled} from "../../../styled-system/jsx/index.js";
import {useFullscreen} from "../../hooks/useFullscreen/index.js";

const Wrapper = styled("div", {
  base: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "40px",
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

// TODO: replace with real settings button
const FakeSettingsButton = styled("div", {
  base: {
    padding: "23px",
  },
});

export const Titlebar = () => {
  const fullscreen = useFullscreen();

  if (!fullscreen) {
    return (
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
  }

  return null;
};
