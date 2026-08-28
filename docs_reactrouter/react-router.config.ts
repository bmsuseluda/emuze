import type { Config } from "@react-router/dev/config";
import { categories } from "../app/server/categoriesDB.server/index.js";

export default {
  ssr: false,
  prerender: ["/", ...Object.keys(categories).map((id) => `/systems/${id}`)],
} satisfies Config;
