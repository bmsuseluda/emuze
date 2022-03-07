import { useTestId } from "~/hooks/useTestId";
import { styled } from "~/stitches";
import { Entries } from "~/types/category";
import { Ul } from "../Ul";
import { Entry } from "./components/Entry";

interface Props {
  entries: Entries;
  onDoubleClick: () => void;
  onSelect: () => void;
  "data-testid"?: string;
}

const List = styled(Ul, {
  display: "flex",
  flexWrap: "wrap",
  gap: "$2",
});

export const EntryList = ({
  entries,
  onDoubleClick,
  onSelect,
  "data-testid": dataTestid,
}: Props) => {
  const { getTestId } = useTestId(dataTestid);
  return (
    <List {...getTestId()}>
      {entries.map(({ id, name, imageUrl }) => (
        <Entry
          id={id}
          name={name}
          imageUrl={imageUrl}
          onDoubleClick={onDoubleClick}
          onSelect={onSelect}
          key={id}
          {...getTestId("entry")}
        />
      ))}
    </List>
  );
};
