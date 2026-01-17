import type { ComponentPropsWithoutRef, ComponentRef, RefObject } from "react";
import { useCallback } from "react";
import type { Entry as GameType } from "../../types/jsonFiles/category.js";
import type { EntryWithSystem as GameTypeLastPlayed } from "../../types/jsonFiles/lastPlayed.js";
import { isEntryWithSystem } from "../../types/jsonFiles/lastPlayed.js";
import { Ul } from "../Ul/index.js";
import { Game } from "./components/Game/index.js";
import type { Result } from "../../hooks/useGamepadsOnGrid/index.js";
import { useGamepadsOnGrid } from "../../hooks/useGamepadsOnGrid/index.js";
import { styled } from "../../../styled-system/jsx/index.js";
import { useAddEntriesToRenderOnScrollEnd } from "../../hooks/useAddEntriesToRenderOnScrollEnd/index.js";
import { SystemIcon } from "../SystemIcon/index.js";
import {
  useInputBack,
  useInputConfirmation,
} from "../../hooks/useDirectionalInput/index.js";
import { useGamepadConnected } from "../../hooks/useGamepadConnected/index.js";

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
    containerName: "gameGrid",
  },
});

const List = styled(Ul, {
  base: {
    position: "relative",
    display: "grid",
    gap: "1",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",

    "@container gameGrid (inline-size > 1440px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    },
  },
});

const IntersectionIndicator = styled("div", {
  base: {
    position: "absolute",
    right: 0,
    bottom: "0.0625rem",
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
}: Props & { inViewRef?: RefObject<ComponentRef<"div"> | null> }) => {
  const { isEnabled } = useGamepadConnected();

  const selectEntry = (game: ComponentRef<"input">) => {
    if (!game.checked) {
      game.checked = true;
    }
    if (document.activeElement !== game) {
      game.focus();
    }
  };

  const goBack = useCallback(
    (selectedGame: RefObject<ComponentRef<"input"> | undefined>) => {
      if (selectedGame.current) {
        selectedGame.current.checked = false;
      }
      onBack();
    },
    [onBack],
  );

  const onLeftOverTheEdge = useCallback(
    ({ selectedEntry }: Result<ComponentRef<"input">>) => {
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

  useInputConfirmation(handleExecute);
  useInputBack(handleBack);

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
              isInFocus={isEnabled.current && isInFocus}
            />
          );
        })}
        <IntersectionIndicator ref={inViewRef} />
      </List>
    </Container>
  );
};
