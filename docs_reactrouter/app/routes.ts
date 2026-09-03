import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("systems", "./routes/docs.tsx", [
    route(":systemId", "./routes/system.tsx"),
  ]),
] satisfies RouteConfig;
