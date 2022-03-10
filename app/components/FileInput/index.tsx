import { styled } from "~/stitches";

import { Button } from "../Button";
import { TextInput } from "../TextInput";

interface Props {
  children: React.ReactNode;
}

const Wrapper = styled("div", {
  display: "flex",
  gap: "$1",
});

export const FileInput = ({ children }: Props) => {
  return <Wrapper>{children}</Wrapper>;
};

FileInput.TextInput = TextInput;
FileInput.Button = Button;
