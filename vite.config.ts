import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This config file is only necessary for storybook
export default defineConfig({
  plugins: [react()],
});
