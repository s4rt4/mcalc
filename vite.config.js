import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_DEV_HOST;

// Port 1430/1431 dipilih khusus agar TIDAK bentrok dengan project Tauri lain
// (meusic & mark-hulk memakai 1420/1421 dengan strictPort).
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  clearScreen: false,
  server: {
    port: 1430,
    strictPort: true,
    host: host || false,
    hmr: host
      ? { protocol: "ws", host, port: 1431 }
      : undefined,
    watch: { ignored: ["**/src-tauri/**"] },
  },
});
