import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Carga las variables del archivo .env
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": { ...process.env },
  },
});
