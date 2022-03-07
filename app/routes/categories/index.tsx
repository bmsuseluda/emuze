import { useTestId } from "~/hooks/useTestId";

export default function Index() {
  const { getTestId } = useTestId(["categories", "index"]);
  return (
    <>
      <p {...getTestId("paragraph")}>Choose a Category in the sidebar</p>
    </>
  );
}
