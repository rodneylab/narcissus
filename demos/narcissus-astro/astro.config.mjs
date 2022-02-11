import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'node:path';
import { imagetools } from 'vite-imagetools';
import urls from 'rehype-urls';

export default {
  // projectRoot: '.',     // Where to resolve all URLs relative to. Useful if you have a monorepo project.
  // pages: './src/pages', // Path to Astro components, pages, and data
  // dist: './dist',       // When running `astro build`, path to final static output
  // public: './public',   // A folder of static files Astro will copy to the root. Useful for favicons, images, and other files that don’t need processing.
  buildOptions: {
    site: 'https://narcissus-astro.rodneylab.com', // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
    sitemap: true, // Generate sitemap (set to "false" to disable)
  },
  devOptions: {
    // hostname: 'localhost',  // The hostname to run the dev server on.
    // port: 3000,             // The port to run the dev server on.
    // tailwindConfig: '',     // Path to tailwind.config.js if used, e.g. './tailwind.config.js'
  },
  markdownOptions: {
    render: [
      '@astrojs/markdown-remark',
      {
        rehypePlugins: [
          [
            'rehype-slug',
            [
              urls,
              (url, node) => {
                if (url.host !== 'internal.site') {
                  node.properties.target = '_blank';
                  node.properties.rel = 'nofollow noopener noreferrer';
                }
              },
            ],
          ],
        ],
      },
    ],
  },
  renderers: ['@astrojs/renderer-react', '@astrojs/renderer-svelte'],
  vite: {
    plugins: [vanillaExtractPlugin(), imagetools({ force: true })],
  },
};
