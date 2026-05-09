import { Dialog } from "../Dialog/index.js";
import { FaBell } from "react-icons/fa";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ListActionBarLayout } from "../layouts/ListActionBarLayout/index.js";
import { SidebarMainLayout } from "../layouts/SidebarMainLayout/index.js";
import type { ForwardedRef } from "react";
import { styled } from "../../../styled-system/jsx/index.js";

const ReleaseNotesContainer = styled("div", {
  base: {
    fontSize: "small",

    "& ul": {
      listStyle: "revert",
      paddingLeft: "revert",
      display: "flex",
      flexDirection: "column",
      marginBottom: "2",
      gap: "10px",
    },

    "& ul ul": {
      marginBottom: 0,
    },

    "& li": {
      paddingLeft: "revert",
      fontSize: "small",
    },

    "& p": {
      fontSize: "small",
      marginBottom: "2",
    },

    "& code": {
      all: "unset",
      backgroundColor: "#191c20",
      padding: "0.2rem 0.4rem",
      borderRadius: "0.5rem",
    },

    "& a": {
      all: "revert",
      textUnderlineOffset: "0.2rem",
      textDecorationThickness: "0.0625rem",
      color: "#3e87e3",
    },

    "& h2": {
      fontWeight: 400,
      fontSize: "large",
      marginTop: "2",
      marginBottom: "1",
      borderBottom: "0.125rem solid #2d2c2c",
      paddingBottom: "0.125rem",
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
            icon: <FaBell />,
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
