import { TbCancel } from "react-icons/tb";
import { RiShutDownLine } from "react-icons/ri";
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

export const CloseDialog = ({
  open,
  onClose,
  onCancel,
  entryListRef,
  entriesRefCallback,
}: Props) => (
  <Dialog open={open} onClose={onCancel} size="dynamic" showCloseIcon={false}>
    <Content>
      <Headline>Close emuze?</Headline>
      <ButtonRow ref={entryListRef}>
        <li>
          <Button
            onClick={onCancel}
            icon={<TbCancel />}
            ref={entriesRefCallback(0)}
          >
            Cancel
          </Button>
        </li>
        <li>
          <Button
            onClick={onClose}
            icon={<RiShutDownLine />}
            ref={entriesRefCallback(1)}
          >
            Close
          </Button>
        </li>
      </ButtonRow>
    </Content>
  </Dialog>
);
