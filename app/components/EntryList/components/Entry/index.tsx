import { useTestId } from "~/hooks/useTestId";
import { styled } from "~/stitches";
import React from "react";
import type { CSS } from "@stitches/react";

interface Props {
  id: string;
  name: string;
  imageUrl?: string;
  onDoubleClick: () => void;
  "data-testid"?: string;
}

const Wrapper = styled("li", {
  position: "relative",
  minWidth: "200px",
  maxWidth: "300px",
});

const borderStyles: CSS = {
  borderStyle: "solid",
  borderWidth: "$3",
  borderColor: "$backgroundColor",
  borderRadius: "$1",
  position: "relative",
  overflow: "clip",
};

const Label = styled("label", {
  display: "block",
  ...borderStyles,
});

const InnerBorder = styled("div", {
  backgroundColor: "$backgroundColor",
  display: "flex",
  justifyContent: "flex-end",

  ...borderStyles,

  variants: {
    "data-imageUrl": {
      false: {
        background: "$gradiants$default",
      },
    },
  },
});

const Name = styled("div", {
  color: "white",
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  userSelect: "none",
  padding: "$1",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
});

const Input = styled("input", {
  position: "absolute",
  top: "-2px",
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: "-2",
  "&:checked + label": {
    borderColor: "$accent",
  },
});

const Image = styled("img", {
  width: "100%",
});

const getAdditionalInfo = (name: string) =>
  name.substring(name.indexOf("(") + 1, name.indexOf(")"));

const fallbackImageUrl = "/fallback.png";

export const Entry = React.forwardRef<HTMLInputElement, Props>(
  ({ id, name, imageUrl, onDoubleClick, "data-testid": dataTestId }, ref) => {
    const { getTestId } = useTestId(dataTestId);
    const additionalInfo = getAdditionalInfo(name);

    return (
      <Wrapper {...getTestId()}>
        <Input
          type="radio"
          id={id}
          name="entry"
          value={id}
          ref={ref}
          {...getTestId("link")}
        />
        <Label htmlFor={id} onDoubleClick={onDoubleClick}>
          <InnerBorder data-imageUrl={!!imageUrl}>
            <Image
              src={imageUrl || fallbackImageUrl}
              alt={`${name} cover`}
              draggable={false}
            />
            {imageUrl && additionalInfo && <Name>{additionalInfo}</Name>}
            {!imageUrl && <Name>{name}</Name>}
          </InnerBorder>
        </Label>
      </Wrapper>
    );
  }
);
Entry.displayName = "Entry";
