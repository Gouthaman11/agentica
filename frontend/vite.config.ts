import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "../backend/server";

export default defineConfig({
  root: __dirname,
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        path.resolve(__dirname),
        path.resolve(__dirname, "../backend/shared"),
        path.resolve(__dirname, "../backend/server"),
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "../backend/server/**"],
    },
  },
  build: {
    outDir: "../dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "../backend/shared"),
    },
  },
});

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();

      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (url.startsWith("/api/") || url === "/api") {
          return (app as any)(req, res, next);
        }
        return next();
      });
    },
  };
}
