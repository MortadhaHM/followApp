/**
 * vite.config.js
 * Enables proper React JSX transform + Fast Refresh via @vitejs/plugin-react.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});

