import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/api-showcase/",
  server: {
    port: 4444,
    open: true,
  },
});