import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "/", // Ensure no relative path issues on Netlify
  plugins: [react()],
});
