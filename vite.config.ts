import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isReplit = process.env.REPL_ID !== undefined;
  
  return {
    server: {
      host: isReplit ? "0.0.0.0" : "::",
      port: isReplit ? 3000 : 8080,
    },
    plugins: [
      react(),
      // Only use componentTagger in Lovable environment
      mode === 'development' && !isReplit &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Ensure environment variables work in both environments
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
