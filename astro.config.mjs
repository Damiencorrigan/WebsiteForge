// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { business } from './src/data/business-info.ts';

// The public production URL. Overridden per-fork in business-info.ts.
// Used for canonical URLs, sitemap, and absolute OG image URLs.
export default defineConfig({
  site: business.siteUrl,
  // Static output — zero JS by default. CWV bars come nearly free.
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Astro's built-in sharp pipeline: srcset / webp / avif / explicit dims.
    responsiveStyles: true,
  },
  build: {
    // Inline small stylesheets, minify HTML.
    inlineStylesheets: 'auto',
  },
});
