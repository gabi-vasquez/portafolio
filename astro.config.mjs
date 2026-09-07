// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Origen canónico. Mantener sincronizado con `origin`/`base` en src/data/site.ts.
// https://astro.build/config
export default defineConfig({
  // TODO: reemplazar por el dominio final cuando se publique
  // (dominio propio → site: 'https://tudominio.dev', base: '/').
  site: 'https://gabi-vasquez.github.io',
  base: '/portafolio',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});