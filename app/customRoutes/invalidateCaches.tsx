import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  invalidateAppearanceDataCache,
  invalidateGeneralDataCache,
} from "../server/settings.server";
import { invalidateCategoriesDataCache } from "../server/categories.server";
import { invalidateLastPlayedDataCache } from "../server/lastPlayed.server";
import { invalidateCategoryDataCache } from "../server/categoryDataCache.server";

export const loader: LoaderFunction = () => {
  invalidateGeneralDataCache();
  invalidateAppearanceDataCache();
  invalidateCategoriesDataCache();
  invalidateCategoryDataCache();
  invalidateLastPlayedDataCache();

  throw redirect("/");
};
