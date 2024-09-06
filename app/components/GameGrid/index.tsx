import type {
  ComponentPropsWithoutRef,
  ElementRef,
  MutableRefObject,
  RefObject,
} from "react";
import { useCallback } from "react";
import type { Entry as GameType } from "../../types/jsonFiles/category";
import type { EntryWithSystem as GameTypeLastPlayed } from "../../types/jsonFiles/lastPlayed";
import { isEntryWithSystem } from "../../types/jsonFiles/lastPlayed";
import { Ul } from "../Ul";
import { Game } from "./components/Game";
import type { Result } from "../../hooks/useGamepadsOnGrid";
import { useGamepadsOnGrid } from "../../hooks/useGamepadsOnGrid";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "../../hooks/useGamepadEvent";
import { layout } from "../../hooks/useGamepads/layouts";
import { styled } from "../../../styled-system/jsx";
import { useAddEntriesToRenderOnScrollEnd } from "../../hooks/useAddEntriesToRenderOnScrollEnd";
import { SystemIcon } from "../SystemIcon";

interface Props extends ComponentPropsWithoutRef<"ul"> {
  games: GameType[] | GameTypeLastPlayed[];
  alwaysGameNames?: boolean;
  isInFocus: boolean;
  onBack: () => void;
  onGameClick: () => void;
  onExecute: () => void;
}

const Container = styled("div", {
  base: {
    containerType: "inline-size",
  },
});

const List = styled(Ul, {
  base: {
    position: "relative",
    display: "grid",
    gap: "1",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",

    "@container (inline-size > 1440px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    },
  },
});

const IntersectionIndicator = styled("div", {
  base: {
    position: "absolute",
    right: 0,
    bottom: "1px",
    zIndex: 0,
    minHeight: "320px",
  },
});

export const GameGridDynamic = ({ games, ...rest }: Props) => {
  const { entriesToRender, inViewRef } = useAddEntriesToRenderOnScrollEnd(
    games || [],
  );

  return <GameGrid games={entriesToRender} inViewRef={inViewRef} {...rest} />;
};

export const GameGrid = ({
  games,
  alwaysGameNames = false,
  isInFocus,
  onBack,
  onExecute,
  onGameClick,
  inViewRef,
}: Props & { inViewRef?: RefObject<ElementRef<"div">> }) => {
  const selectEntry = (game: ElementRef<"input">) => {
    game.checked = true;
    game.focus();
  };

  const goBack = useCallback(
    (selectedGame: MutableRefObject<ElementRef<"input"> | undefined>) => {
      if (selectedGame.current) {
        selectedGame.current.checked = false;
      }
      onBack();
    },
    [onBack],
  );

  const onLeftOverTheEdge = useCallback(
    ({ selectedEntry }: Result<ElementRef<"input">>) => {
      goBack(selectedEntry);
    },
    [goBack],
  );

  const {
    entryListRef,
    entriesRefs,
    entriesRefCallback,
    selectedEntry,
    updatePosition,
  } = useGamepadsOnGrid({
    onSelectEntry: selectEntry,
    isInFocus,
    onLeftOverTheEdge,
  });

  const handleBack = useCallback(() => {
    if (isInFocus) {
      goBack(selectedEntry);
    }
  }, [isInFocus, selectedEntry, goBack]);

  const handleExecute = useCallback(() => {
    if (isInFocus) {
      if (selectedEntry.current) {
        onExecute();
      }
    }
  }, [isInFocus, selectedEntry, onExecute]);

  useGamepadButtonPressEvent(layout.buttons.B, handleBack);
  useGamepadButtonPressEvent(layout.buttons.A, handleExecute);
  useKeyboardEvent("Backspace", handleBack);
  useKeyboardEvent("Enter", handleExecute);

  return (
    <Container>
      <List ref={entryListRef}>
        {games.map((game, index) => {
          const { id, name, metaData } = game;
          // TODO: think about if this should be a callback from useGamepadsOnGrid
          const handleClick = () => {
            onGameClick();
            selectedEntry.current = entriesRefs.current[index];
            updatePosition();
          };
          const handleDoubleClick = () => {
            onExecute();
          };

          return (
            <Game
              id={id}
              name={name}
              icon={
                isEntryWithSystem(game) ? (
                  <SystemIcon id={game.systemId} />
                ) : null
              }
              imageUrl={metaData?.imageUrl}
              alwaysGameName={alwaysGameNames}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              ref={entriesRefCallback(index)}
              key={id}
            />
          );
        })}
        <IntersectionIndicator ref={inViewRef} />
      </List>
    </Container>
  );
};
