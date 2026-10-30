import { ShouldRevalidateFunction } from "react-router";

export const shouldRevalidateCategoriesRoute: ShouldRevalidateFunction = ({
  nextUrl,
  actionResult,
  defaultShouldRevalidate,
}) => {
  if (
    nextUrl.searchParams.get("revalidate") === "true" ||
    actionResult?.revalidateCategories
  ) {
    return true;
  }

  if (nextUrl.pathname.includes("/settings")) {
    return false;
  }

  if (actionResult?.ok) {
    return false;
  }

  return defaultShouldRevalidate;
};
