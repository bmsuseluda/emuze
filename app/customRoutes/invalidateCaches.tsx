import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";
import {
  invalidateAppearanceDataCache,
  invalidateGeneralDataCache,
} from "../server/settings.server.js";
import { invalidateCategoriesDataCache } from "../server/categories.server.js";
import { invalidateLastPlayedDataCache } from "../server/lastPlayed.server.js";
import { invalidateCategoryDataCache } from "../server/categoryDataCache.server.js";

export const loader: LoaderFunction = () => {
  invalidateGeneralDataCache();
  invalidateAppearanceDataCache();
  invalidateCategoriesDataCache();
  invalidateCategoryDataCache();
  invalidateLastPlayedDataCache();

  throw redirect("/");
};
