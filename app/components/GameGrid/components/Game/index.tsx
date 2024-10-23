import type { ElementRef, ReactNode, SyntheticEvent } from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { styled } from "../../../../../styled-system/jsx";

interface Props {
  id: string;
  name: string;
  icon?: ReactNode;
  alwaysGameName?: boolean;
  imageUrl?: string;
  onClick: () => void;
  onDoubleClick: () => void;
  isInFocus: boolean;
}

const Wrapper = styled("li", {
  base: {
    position: "relative",
    minWidth: "200px",
    maxWidth: "300px",
    transition: "0.1s ease-in-out",
  },
});

const Label = styled("label", {
  base: {
    backgroundColor: "backgroundColor",
    display: "flex",
    justifyContent: "flex-end",
    borderRadius: "1",
    overflow: "clip",

    margin: "4px",
    outlineWidth: "4px",
    outlineStyle: "solid",
    outlineColor: "transparent",
    outlineOffset: "4px",
    transition: "outline-color 0.1s ease-in-out",

    "&:has(*:checked)": {
      outlineColor: "accent",
    },
  },
  variants: {
    isInFocus: {
      true: {
        "&:has(*:checked)": {
          animation: "focused 3s linear infinite",
        },
      },
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
    opacity: 0,
  },
});

const ImageWrapper = styled("div", {
  base: {
    position: "relative",
    width: "100%",
  },
});

const Image = styled("img", {
  base: {
    width: "100%",
    height: "100%",
  },
});

const IconWrapper = styled("div", {
  base: {
    color: "color",
    position: "absolute",
    top: 0,
    right: 0,
    userSelect: "none",
    padding: "0.4em",
    margin: "0.3em",
    backgroundColor: "transparentBackgroundColor",
    borderRadius: "50%",

    "& > svg": {
      width: "1em",
      height: "1em",
      verticalAlign: "middle",
    },
  },
});

const Name = styled("div", {
  base: {
    _before: {
      content: '""',
      position: "absolute",
      minHeight: "1rem",
      left: 0,
      right: 0,
      top: "-1rem",
      backgroundColor: "transparentBackgroundColor",
      maskPosition: "bottom",
      maskImage:
        "linear-gradient(" +
        "to top, " +
        "{colors.backgroundColor} 10%, " +
        "transparent)",
    },

    color: "color",
    position: "absolute",
    bottom: "-1px",
    left: 0,
    right: 0,
    userSelect: "none",
    padding: "0 0.8rem 0.4rem",
    backgroundColor: "transparentBackgroundColor",
    fontWeight: 400,
    fontSize: "80%",
    lineHeight: "1.3rem",
  },
});

const fallbackImageUrl = "/fallback.png";

export const getDisplayedName = (
  name: string,
  alwaysGameName: boolean,
  isImage: boolean,
  error: boolean,
) => {
  const nameWithoutAdditionalInfo = name.split(" (")[0];
  if (error) {
    return nameWithoutAdditionalInfo;
  }

  if (!alwaysGameName && isImage) {
    return undefined;
  }

  return nameWithoutAdditionalInfo;
};

const getImageSrc = ({ imageUrl }: { imageUrl?: string }) => {
  if (!imageUrl) {
    return fallbackImageUrl;
  }

  return imageUrl;
};

export const Game = forwardRef<ElementRef<typeof Input>, Props>(
  (
    {
      id,
      name,
      alwaysGameName = false,
      imageUrl,
      onClick,
      onDoubleClick,
      icon,
      isInFocus,
    },
    ref,
  ) => {
    const [error, setError] = useState(false);

    // TODO: remove ref and useEffect if bug is resolved https://github.com/facebook/react/issues/15446
    const imageRef = useRef<ElementRef<"img">>(null);
    useEffect(() => {
      if (imageRef && imageRef.current) {
        const { complete, naturalHeight } = imageRef.current;
        const errorLoadingImgBeforeHydration = complete && naturalHeight === 0;

        if (errorLoadingImgBeforeHydration) {
          setError(true);
          imageRef.current.src = fallbackImageUrl;
        }
      }
    }, []);

    const displayedName = getDisplayedName(
      name,
      alwaysGameName,
      !!imageUrl,
      error,
    );

    const handleImageError = (
      event: SyntheticEvent<HTMLImageElement, Event>,
    ) => {
      setError(true);
      event.currentTarget.src = fallbackImageUrl;
    };

    return (
      <Wrapper>
        <Label
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          isInFocus={isInFocus}
        >
          <Input type="radio" name="game" value={id} ref={ref} />
          <ImageWrapper>
            {icon && <IconWrapper>{icon}</IconWrapper>}
            <Image
              src={getImageSrc({ imageUrl })}
              alt={`${name} cover`}
              draggable={false}
              onError={handleImageError}
              ref={imageRef}
            />
            {displayedName && <Name>{displayedName}</Name>}
          </ImageWrapper>
        </Label>
      </Wrapper>
    );
  },
);
Game.displayName = "Game";
