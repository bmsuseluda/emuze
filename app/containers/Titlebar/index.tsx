import { styled } from "~/stitches";
import { IconButton } from "./components/IconButton";
import { useFullscreen } from "~/hooks/useFullscreen";

const Wrapper = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  height: "25px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
});

const Draggable = styled("div", {
  width: "100%",
  height: "100%",
  WebkitAppRegion: "drag",
});

const Buttons = styled("div", {
  display: "flex",
  whiteSpace: "nowrap",
});

const FakeSettingsButton = styled("div", {
  width: "16px",
  height: "16px",
  padding: "12.8px 15px",
});

export const Titlebar = () => {
  const fullscreen = useFullscreen();

  if (!fullscreen) {
    return (
      <Wrapper>
        <Draggable />
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
