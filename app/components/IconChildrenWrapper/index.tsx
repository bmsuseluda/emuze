import { styled } from "~/stitches";

const Wrapper = styled("span", {
  variants: {
    icon: {
      true: {
        display: "flex",
        flexDirection: "row",
        gap: "$1",
        alignItems: "center",
        "> svg": {
          minWidth: "1.3em",
          minHeight: "1.3em",
          maxWidth: "1.3em",
          maxHeight: "1.3em",
        },
      },
    },
  },
});

type Props = {
  icon?: React.ReactNode;
  children: React.ReactNode;
};

// TODO: add story
export const IconChildrenWrapper = ({ icon, children, ...rest }: Props) => (
  <Wrapper icon={!!icon} {...rest}>
    {icon && icon}
    {children}
  </Wrapper>
);
