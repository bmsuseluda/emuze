import { Dialog } from "../Dialog/index.js";
import { MdErrorOutline } from "react-icons/md";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ListActionBarLayout } from "../layouts/ListActionBarLayout/index.js";
import { SidebarMainLayout } from "../layouts/SidebarMainLayout/index.js";
import type { ForwardedRef } from "react";
import { styled } from "../../../styled-system/jsx/index.js";

const ReleaseNotesContainer = styled("div", {
  base: {
    whiteSpace: "pre-wrap",
    fontSize: "small",

    "& ul": {
      listStyle: "revert",
      paddingLeft: "revert",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },

    "& li": {
      paddingLeft: "revert",
      fontSize: "small",
    },

    "& p": {
      fontSize: "small",
      marginBottom: "1",
    },

    "& code": {
      backgroundColor: "#1e232a",
      padding: "0.2rem 0.4rem",
      borderRadius: "0.5rem",
    },

    "& a": {
      all: "revert",
    },

    "& h2": {
      fontWeight: 400,
      fontSize: "large",
      marginTop: "2",
      marginBottom: "1",
    },

    "& h3": {
      fontWeight: 400,
      fontSize: "medium",
      marginTop: "2",
      marginBottom: "1",
    },
  },
});

interface Props {
  releaseNotesMarkdown: string;
  onClose: () => void;
  listRef?: ForwardedRef<HTMLDivElement>;
}

export const ReleaseNotesDialog = ({
  releaseNotesMarkdown,
  onClose,
  listRef,
}: Props) => (
  <Dialog open={true} onClose={onClose} variant="accent" size="dynamic">
    <SidebarMainLayout>
      <SidebarMainLayout.Main>
        <ListActionBarLayout
          headline={{
            title: "Release Notes",
            icon: <MdErrorOutline />,
          }}
        >
          <ListActionBarLayout.ListActionBarContainer
            listRef={listRef}
            scrollSmooth
            list={
              <ReleaseNotesContainer>
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  disallowedElements={["h1"]}
                >
                  {releaseNotesMarkdown}
                </Markdown>
              </ReleaseNotesContainer>
            }
            dynamicHeight
          />
        </ListActionBarLayout>
      </SidebarMainLayout.Main>
    </SidebarMainLayout>
  </Dialog>
);
