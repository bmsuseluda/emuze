import { Dialog } from "../Dialog";
import { styled } from "../../../styled-system/jsx";
import { Headline } from "../Headline";
import { Button } from "../Button";
import type { RefObject } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  entryListRef: RefObject<HTMLUListElement>;
  entriesRefCallback: (index: number) => (ref: HTMLButtonElement) => void;
}

const Content = styled("div", {
  base: {
    backgroundColor: "backgroundColor",
    padding: 1,
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
});

const ButtonRow = styled("ul", {
  base: {
    display: "flex",
    justifyContent: "center",
    gap: 1,
  },
});

export const CloseDialog = ({
  open,
  onClose,
  onCancel,
  entryListRef,
  entriesRefCallback,
}: Props) => (
  <Dialog open={open} onClose={onClose} size="dynamic" closable={false}>
    <Content>
      <Headline>Close emuze?</Headline>
      <ButtonRow ref={entryListRef}>
        <li>
          <Button onClick={onCancel} ref={entriesRefCallback(0)}>
            No
          </Button>
        </li>
        <li>
          <Button onClick={onClose} ref={entriesRefCallback(1)}>
            Yes
          </Button>
        </li>
      </ButtonRow>
    </Content>
  </Dialog>
);
