import { Dialog } from "../Dialog/index.js";
import { IconChildrenWrapper } from "../IconChildrenWrapper/index.js";
import { Typography } from "../Typography/index.js";
import { MdErrorOutline } from "react-icons/md";
import { ListActionBarLayout } from "../layouts/ListActionBarLayout/index.js";
import { SidebarMainLayout } from "../layouts/SidebarMainLayout/index.js";
import type { ForwardedRef } from "react";
import { styled } from "../../../styled-system/jsx/index.js";

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
  <Dialog open={true} onClose={onClose} variant="accent" size="small">
    <SidebarMainLayout>
      <SidebarMainLayout.Main>
        <ListActionBarLayout
          headline={
            <IconChildrenWrapper>
              <MdErrorOutline />
              <Typography ellipsis>{title}</Typography>
            </IconChildrenWrapper>
          }
        >
          <ListActionBarLayout.ListActionBarContainer
            listRef={listRef}
            scrollSmooth
            list={<Stacktrace>{stacktrace}</Stacktrace>}
          />
        </ListActionBarLayout>
      </SidebarMainLayout.Main>
    </SidebarMainLayout>
  </Dialog>
);
