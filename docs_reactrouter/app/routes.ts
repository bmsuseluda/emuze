import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("systems/:systemId", "./routes/system.tsx"),
] satisfies RouteConfig;
