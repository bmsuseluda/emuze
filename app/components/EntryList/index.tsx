import { useTestId } from "~/hooks/useTestId";
import { styled } from "~/stitches";
import type { Entries } from "~/types/category";
import { Ul } from "../Ul";
import { Entry } from "./components/Entry";

interface Props {
  entries: Entries;
  entriesRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onDoubleClick: () => void;
  onSelect: (index: number) => void;
  "data-testid"?: string;
}

const List = styled(Ul, {
  display: "flex",
  flexWrap: "wrap",
  gap: "$2",
});

export const EntryList = ({
  entries,
  entriesRefs,
  onDoubleClick,
  onSelect,
  "data-testid": dataTestid,
}: Props) => {
  const { getTestId } = useTestId(dataTestid);
  return (
    <List {...getTestId()}>
      {entries.map(({ id, name, imageUrl }, index) => (
        <Entry
          id={id}
          name={name}
          imageUrl={imageUrl}
          onDoubleClick={onDoubleClick}
          onSelect={() => onSelect(index)}
          ref={(ref) => {
            if (index === 0) {
              entriesRefs.current = [ref];
            } else {
              entriesRefs.current.push(ref);
            }
          }}
          key={id}
          {...getTestId("entry")}
        />
      ))}
    </List>
  );
};
