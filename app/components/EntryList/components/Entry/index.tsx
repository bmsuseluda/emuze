import { useTestId } from "~/hooks/useTestId";
import type { ElementRef } from "react";
import { forwardRef } from "react";
import { styled } from "../../../../../styled-system/jsx";

interface Props {
  id: string;
  name: string;
  alwaysGameName?: boolean;
  imageUrl?: string;
  onDoubleClick: () => void;
  "data-testid"?: string;
}

const Wrapper = styled("li", {
  base: {
    position: "relative",
    minWidth: "200px",
    maxWidth: "300px",
  },
});

const Label = styled("label", {
  base: {
    backgroundColor: "backgroundColor",
    display: "flex",
    justifyContent: "flex-end",
    borderWidth: "4px",
    borderStyle: "solid",
    borderColor: "backgroundColor",
    borderRadius: "1",
    overflow: "clip",

    margin: "4px",
    outlineWidth: "4px",
    outlineStyle: "solid",
    outlineColor: "backgroundColor",

    "&:has(*:checked)": {
      outlineColor: "accent",
    },
  },
});

const Input = styled("input", {
  base: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: "-2",
  },
});

const ImageWrapper = styled("div", {
  base: {
    position: "relative",
  },
});

const Image = styled("img", {
  base: {
    width: "100%",
    height: "100%",
  },
});

const Name = styled("div", {
  base: {
    color: "color",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    userSelect: "none",
    padding: "1",
    backgroundColor: "transparentBackgroundColor",
    fontWeight: 400,
    fontSize: "80%",
  },
});

const getAdditionalInfo = (name: string) =>
  name.substring(name.indexOf("(") + 1, name.indexOf(")"));

const fallbackImageUrl = "/fallback.png";

export const getDisplayedName = (
  name: string,
  alwaysGameName: boolean,
  isImage: boolean,
) => {
  const additionalInfo = getAdditionalInfo(name);

  if (!alwaysGameName && isImage) {
    if (additionalInfo) {
      return additionalInfo;
    } else {
      return undefined;
    }
  }

  return name;
};

export const Entry = forwardRef<ElementRef<typeof Input>, Props>(
  (
    {
      id,
      name,
      alwaysGameName = false,
      imageUrl,
      onDoubleClick,
      "data-testid": dataTestId,
    },
    ref,
  ) => {
    const { getTestId } = useTestId(dataTestId);
    const displayedName = getDisplayedName(name, alwaysGameName, !!imageUrl);

    return (
      <Wrapper {...getTestId()}>
        <Label onDoubleClick={onDoubleClick}>
          <Input
            type="radio"
            name="entry"
            value={id}
            ref={ref}
            {...getTestId("link")}
          />
          <ImageWrapper>
            <Image
              src={imageUrl || fallbackImageUrl}
              alt={`${name} cover`}
              draggable={false}
            />
            {displayedName && <Name>{displayedName}</Name>}
          </ImageWrapper>
        </Label>
      </Wrapper>
    );
  },
);
Entry.displayName = "Entry";
