import { useTestId } from "~/hooks/useTestId";
import React from "react";
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
    display: "block",
    backgroundColor: "backgroundColor",
    borderRounded: true,
    borderWidth: "4px",
    borderStyle: "solid",
    borderColor: "backgroundColor",

    "&:has(*:checked)": {
      borderColor: "accent",
    },
  },
});

const InnerBorder = styled("div", {
  base: {
    backgroundColor: "backgroundColor",
    display: "flex",
    justifyContent: "flex-end",
    borderRounded: true,
    borderWidth: "4px",
    borderStyle: "solid",
    borderColor: "backgroundColor",
  },
});

const Name = styled("div", {
  base: {
    color: "white",
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

const Input = styled("input", {
  base: {
    position: "absolute",
    top: "-4px",
    left: "-4px",
    width: "100%",
    height: "100%",
    zIndex: "-2",
  },
});

const Image = styled("img", {
  base: {
    width: "100%",
    height: "100%",
  },
});

const getAdditionalInfo = (name: string) =>
  name.substring(name.indexOf("(") + 1, name.indexOf(")"));

const fallbackImageUrl = "/fallback.png";

export const getDisplayedName = (
  name: string,
  alwaysGameName: boolean,
  isImage: boolean
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

export const Entry = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      name,
      alwaysGameName = false,
      imageUrl,
      onDoubleClick,
      "data-testid": dataTestId,
    },
    ref
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
          <InnerBorder>
            <Image
              src={imageUrl || fallbackImageUrl}
              alt={`${name} cover`}
              draggable={false}
            />
            {displayedName && <Name>{displayedName}</Name>}
          </InnerBorder>
        </Label>
      </Wrapper>
    );
  }
);
Entry.displayName = "Entry";
