import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from 'vite-plugin-pwa'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['android-launchericon-192-192.png', 'android-launchericon-512-512.png', 'LargeTile.scale-400.png'],
          manifest: {
            name: 'My Cool App',
            short_name: 'Nest Bank',
            description: 'Digital Banking Hub',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '/',
            icons: [
              {
                src: 'android-launchericon-192-192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'android-launchericon-512-512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
