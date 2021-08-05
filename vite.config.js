import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import { injectHtml } from 'vite-plugin-html';

const manifest = {
  name: 'Waqt',
  short_name: 'Waqt',
  icons: [
    {
      src: '/img/icons/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/img/icons/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
  start_url: '/',
  display: 'standalone',
  background_color: '#222222',
  theme_color: '#ff8e00',
};

const colorSchemeScript = `
<script>
// wrapped as IIFE to use private variables and functions
(function () {
  const preferredTheme = localStorage.getItem('colorScheme');
  if (document.body != null) {
    document.body.className = preferredTheme;
  }
})();
</script>
`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    injectHtml({
      injectData: {
        colorSchemeScript,
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest,
    }),
  ],
});
