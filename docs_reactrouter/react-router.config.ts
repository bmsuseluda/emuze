import type { Config } from "@react-router/dev/config";
import { categories } from "../app/server/categoriesDB.server/index.js";

const getSystemRoutes = () => {
  const systemRoutes: string[] = [];
  Object.keys(categories).forEach((id) => {
    if (id !== "lastPlayed") {
      systemRoutes.push(`/systems/${id}`);
    }
  });

  return systemRoutes;
};

export default {
  ssr: false,
  prerender: ["/", ...getSystemRoutes()],
} satisfies Config;
