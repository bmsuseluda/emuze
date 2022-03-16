import { useTestId } from "~/hooks/useTestId";
import { styled } from "~/stitches";

interface Props {
  id: string;
  name: string;
  imageUrl?: string;
  onDoubleClick: () => void;
  onSelect: () => void;
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
  "&:hover, &:focus": {
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

export const Entry = ({
  id,
  name,
  imageUrl,
  onDoubleClick,
  onSelect,
  "data-testid": dataTestId,
}: Props) => {
  const { getTestId } = useTestId(dataTestId);
  return (
    <Wrapper {...getTestId()}>
      <Input
        type="radio"
        id={id}
        name="entry"
        value={id}
        onChange={(event) => {
          if (event.currentTarget.checked) {
            onSelect();
          }
        }}
        {...getTestId("link")}
      />
      <Label
        htmlFor={id}
        onDoubleClick={onDoubleClick}
        data-imageUrl={!!imageUrl}
      >
        {imageUrl && (
          <img
            style={{ maxWidth: "200px" }}
            src={imageUrl}
            alt={`${name} cover`}
          />
        )}
        <Name>{name}</Name>
      </Label>
    </Wrapper>
  );
};
