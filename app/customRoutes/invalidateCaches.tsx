import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  invalidateAppearanceDataCache,
  invalidateGeneralDataCache,
} from "../server/settings.server";
import {
  invalidateCategoriesDataCache,
  invalidateCategoryDataCache,
} from "../server/categories.server";
import { invalidateLastPlayedDataCache } from "../server/lastPlayed.server";

export const loader: LoaderFunction = () => {
  invalidateGeneralDataCache();
  invalidateAppearanceDataCache();
  invalidateCategoriesDataCache();
  invalidateCategoryDataCache();
  invalidateLastPlayedDataCache();

  throw redirect("/");
};
