import { Dialog } from "../Dialog/index.js";
import { styled } from "../../../styled-system/jsx/index.js";
import { Headline } from "../Headline/index.js";
import type { Props as ButtonProps } from "../Button/index.js";
import { Button } from "../Button/index.js";
import type { RefObject } from "react";

interface Props {
  open: boolean;
  headline: string;
  cancelButtonDefinition: ButtonProps;
  confirmButtonDefinition: ButtonProps;
  entryListRef: RefObject<HTMLUListElement | null>;
  entriesRefCallback: (index: number) => (ref: HTMLButtonElement) => void;
  onDialogClose: () => void;
}

const Content = styled("div", {
  base: {
    backgroundColor: "backgroundColor",
    padding: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
});

const ButtonRow = styled("ul", {
  base: {
    display: "flex",
    justifyContent: "center",
    gap: 1,
  },
});

export const ConfirmationDialog = ({
  open,
  headline,
  cancelButtonDefinition,
  confirmButtonDefinition,
  onDialogClose,
  entryListRef,
  entriesRefCallback,
}: Props) => (
  <Dialog open={open} onClose={onDialogClose} size="dynamic">
    <Content>
      <Headline>{headline}</Headline>
      <ButtonRow ref={entryListRef}>
        <li>
          <Button {...cancelButtonDefinition} ref={entriesRefCallback(0)} />
        </li>
        <li>
          <Button {...confirmButtonDefinition} ref={entriesRefCallback(1)} />
        </li>
      </ButtonRow>
    </Content>
  </Dialog>
);
