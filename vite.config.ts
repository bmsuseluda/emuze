import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// This config file is only necessary for storybook
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
