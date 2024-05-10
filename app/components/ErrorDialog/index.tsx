import { Dialog } from "../Dialog";
import { IconChildrenWrapper } from "../IconChildrenWrapper";
import { Typography } from "../Typography";
import { MdErrorOutline } from "react-icons/md";
import { ListActionBarLayout } from "../layouts/ListActionBarLayout";
import { SidebarMainLayout } from "../layouts/SidebarMainLayout";
import type { ForwardedRef } from "react";
import { styled } from "../../../styled-system/jsx";

const Stacktrace = styled("p", {
  base: {
    whiteSpace: "pre-wrap",
  },
});

interface Props {
  title?: string;
  stacktrace?: string;
  onClose: () => void;
  listRef?: ForwardedRef<HTMLDivElement>;
}

export const ErrorDialog = ({
  title = "An unexpected error has occurred",
  stacktrace = "An unexpected error has occurred",
  onClose,
  listRef,
}: Props) => (
  <Dialog open onClose={onClose} variant="accent" smaller={true}>
    <SidebarMainLayout>
      <SidebarMainLayout.Main>
        <ListActionBarLayout
          headline={
            <IconChildrenWrapper>
              <MdErrorOutline />
              <Typography>{title}</Typography>
            </IconChildrenWrapper>
          }
        >
          <ListActionBarLayout.ListActionBarContainer
            ref={listRef}
            scrollSmooth
            list={<Stacktrace>{stacktrace}</Stacktrace>}
          />
        </ListActionBarLayout>
      </SidebarMainLayout.Main>
    </SidebarMainLayout>
  </Dialog>
);
