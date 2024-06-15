import type {
  ComponentPropsWithoutRef,
  ElementRef,
  MutableRefObject,
  RefObject,
} from "react";
import { useCallback } from "react";
import { useTestId } from "../../hooks/useTestId";
import type { Entry as GameType } from "../../types/jsonFiles/category";
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

interface Props extends ComponentPropsWithoutRef<"ul"> {
  games: GameType[];
  alwaysGameNames?: boolean;
  isInFocus: boolean;
  onBack: () => void;
  onGameClick: () => void;
  onExecute: () => void;
  "data-testid"?: string;
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
  "data-testid": dataTestid,
  inViewRef,
}: Props & { inViewRef?: RefObject<ElementRef<"div">> }) => {
  const { getTestId } = useTestId(dataTestid);

  const selectEntry = (game: ElementRef<"input">) => {
    game.checked = true;
    game.focus();
  };

  const goBack = useCallback(
    (
      selectedGame: MutableRefObject<ElementRef<"input"> | undefined>,
      resetSelected: () => void,
    ) => {
      if (selectedGame.current) {
        selectedGame.current.checked = false;
        resetSelected();
      }
      onBack();
    },
    [onBack],
  );

  const onLeftOverTheEdge = useCallback(
    ({ selectedEntry, resetSelected }: Result<ElementRef<"input">>) => {
      goBack(selectedEntry, resetSelected);
    },
    [goBack],
  );

  const {
    entryListRef,
    entriesRefs,
    entriesRefCallback,
    selectedEntry,
    resetSelected,
    updatePosition,
  } = useGamepadsOnGrid({
    onSelectEntry: selectEntry,
    isInFocus,
    onLeftOverTheEdge,
  });

  const handleBack = useCallback(() => {
    if (isInFocus) {
      goBack(selectedEntry, resetSelected);
    }
  }, [isInFocus, resetSelected, selectedEntry, goBack]);

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
      <List ref={entryListRef} {...getTestId()}>
        {games.map(({ id, name, metaData }, index) => {
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
              imageUrl={metaData?.imageUrl}
              alwaysGameName={alwaysGameNames}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              ref={entriesRefCallback(index)}
              key={id}
              {...getTestId("game")}
            />
          );
        })}
        <IntersectionIndicator ref={inViewRef} />
      </List>
    </Container>
  );
};
