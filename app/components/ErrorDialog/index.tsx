import { styled } from "styled-system/jsx";
import { Dialog } from "~/components/Dialog";
import { Headline } from "~/components/Headline";
import { IconChildrenWrapper } from "~/components/IconChildrenWrapper";
import { Typography } from "~/components/Typography";
import { MdErrorOutline } from "react-icons/md";

const Body = styled("div", {
  base: {
    position: "relative",
    paddingTop: "1",
    paddingRight: "0.5em",
    paddingBottom: "1",
    paddingLeft: "2",
    display: "flex",
    flexDirection: "column",
    gap: "1",
    backgroundColor: "backgroundColor",
    minWidth: "25rem",
    height: "100%",
  },
});

const Stacktrace = styled("p", {
  base: {
    whiteSpace: "pre-wrap",
    overflowY: "scroll",
  },
});

type Props = {
  title?: string;
  stacktrace?: string;
  onClose: () => void;
};

// TODO: add radix scrollarea
export const ErrorDialog = ({
  title = "An unexpected error has occurred",
  stacktrace = "An unexpected error has occurred",
  onClose,
}: Props) => (
  <Dialog open onClose={onClose}>
    <Body>
      <Headline>
        <IconChildrenWrapper>
          <MdErrorOutline />
          <Typography>{title}</Typography>
        </IconChildrenWrapper>
      </Headline>
      <Stacktrace>{stacktrace}</Stacktrace>
    </Body>
  </Dialog>
);
