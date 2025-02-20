import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,
    host: "0.0.0.0",
    strictPort: true,
    watch: {
	usePolling: true,
    },
    allowedHosts: ['i12b209.p.ssafy.io'],    
    proxy: { 
      "/api": {
        target: "http://i12b209.p.ssafy.io:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "app/dist/",
  },
});
