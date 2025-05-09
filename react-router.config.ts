import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  appDirectory: "app",
  serverModuleFormat: "cjs",
} satisfies Config;
