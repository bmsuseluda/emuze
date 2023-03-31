import type { HTMLAttributes, MutableRefObject } from "react";
import React, { useEffect, useState } from "react";
import { useTestId } from "~/hooks/useTestId";
import { styled } from "~/stitches";
import type { Entries } from "~/types/category";
import { Ul } from "../Ul";
import { Entry } from "./components/Entry";

type Props = {
  entries: Entries;
  alwaysGameNames?: boolean;
  entriesRefs: MutableRefObject<(HTMLInputElement | null)[]>;
  onDoubleClick: () => void;
  "data-testid"?: string;
} & HTMLAttributes<HTMLUListElement>;

const List = styled(Ul, {
  display: "grid",
  gap: "$1",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
});

const entriesNumberForChunk = 50;

export const EntryList = React.forwardRef<HTMLUListElement, Props>(
  (
    {
      entries,
      alwaysGameNames = false,
      entriesRefs,
      onDoubleClick,
      "data-testid": dataTestid,
      ...rest
    },
    listRef
  ) => {
    const { getTestId } = useTestId(dataTestid);

    const [entriesToRender, setEntriesToRender] = useState(
      entries.slice(0, entriesNumberForChunk)
    );
    useEffect(() => {
      setEntriesToRender(entries.slice(0, entriesNumberForChunk));
    }, [entries]);
    useEffect(() => {
      if (entriesToRender.length < entries.length) {
        setEntriesToRender((entriesToRender) => [
          ...entriesToRender,
          ...entries.slice(entriesToRender.length, entries.length),
        ]);
      }
    }, [entriesToRender, entries]);

    return (
      <List ref={listRef} {...getTestId()}>
        {entriesToRender.map(({ id, name, imageUrl }, index) => (
          <Entry
            id={id}
            name={name}
            imageUrl={imageUrl}
            alwaysGameName={alwaysGameNames}
            onDoubleClick={onDoubleClick}
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
  }
);
EntryList.displayName = "EntryList";
