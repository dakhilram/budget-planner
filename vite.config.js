import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/budget-planner/",
  plugins: [react()],
});
