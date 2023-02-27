import { useTestId } from "~/hooks/useTestId";
import { styled } from "~/stitches";
import React from "react";

interface Props {
  id: string;
  name: string;
  alwaysGameName?: boolean;
  imageUrl?: string;
  onDoubleClick: () => void;
  "data-testid"?: string;
}

const Wrapper = styled("li", {
  position: "relative",
  minWidth: "200px",
  maxWidth: "300px",
});

const Label = styled("label", {
  display: "block",
  backgroundColor: "$backgroundColor",
  roundedBorder: true,
});

const InnerBorder = styled("div", {
  backgroundColor: "$backgroundColor",
  display: "flex",
  justifyContent: "flex-end",
  roundedBorder: true,

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
  backgroundColor: "$transparentBackgroundColor",
});

const Input = styled("input", {
  position: "absolute",
  top: "-4px",
  left: "-4px",
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
            {displayedName && <Name>{displayedName}</Name>}
          </InnerBorder>
        </Label>
      </Wrapper>
    );
  }
);
Entry.displayName = "Entry";
