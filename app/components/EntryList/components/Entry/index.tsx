import { useTestId } from "~/hooks/useTestId";
import { styled } from "~/stitches";
import React from "react";

interface Props {
  id: string;
  name: string;
  imageUrl?: string;
  onDoubleClick: () => void;
  "data-testid"?: string;
}

const Wrapper = styled("li", {
  position: "relative",
});

const Label = styled("label", {
  backgroundColor: "$backgroundColor",
  display: "flex",
  width: "200px",
  height: "266px",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderStyle: "solid",
  borderWidth: "$3",
  borderColor: "$backgroundColor",
  borderRadius: "$1",
  "&:focus": {
    borderColor: "$color",
  },
  position: "relative",
  overflow: "clip",

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
  top: "50%",
  left: "50%",
  zIndex: "-2",
  "&:checked + label": {
    borderColor: "$accent",
  },
});

const Image = styled("img", {
  width: "100%",
  minHeight: "200px",

  "&::before": {
    content: " ",
    position: "absolute",
    background: "$gradiants$default",
    width: "200px",
    height: "266px",
    display: "block",
    top: 0,
  },
});

const getAdditionalInfo = (name: string) =>
  name.substring(name.indexOf("(") + 1, name.indexOf(")"));

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
        <Label
          htmlFor={id}
          onDoubleClick={onDoubleClick}
          data-imageUrl={!!imageUrl}
        >
          {imageUrl && (
            <Image src={imageUrl} alt={`${name} cover`} draggable={false} />
          )}
          {!imageUrl && <Name>{name}</Name>}
          {imageUrl && additionalInfo && <Name>{additionalInfo}</Name>}
        </Label>
      </Wrapper>
    );
  }
);
Entry.displayName = "Entry";
