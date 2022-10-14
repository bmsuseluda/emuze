import { useEffect, useState } from "react";
import { styled } from "~/stitches";
import { IconButton } from "./components/IconButton";

const Wrapper = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  height: "25px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
});

const Dragable = styled("div", {
  width: "100%",
  height: "100%",
  WebkitAppRegion: "drag",
});

const Buttons = styled("div", {
  display: "flex",
  whiteSpace: "nowrap",
});

export const Titlebar = () => {
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    electronAPI.onFullscreen((fullscreen) => {
      console.log("fullscreen", fullscreen);

      setFullscreen(fullscreen);
    });
  }, []);

  if (!fullscreen) {
    return (
      <Wrapper>
        <Dragable />
        <Buttons>
          <IconButton variant="minimize" />
          <IconButton variant="maximize" />
          <IconButton variant="close" />
        </Buttons>
      </Wrapper>
    );
  }

  return null;
};
