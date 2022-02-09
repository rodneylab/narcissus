/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';
import 'dotenv/config';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';
import { imagetools } from 'vite-imagetools';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const config = {
  extensions: ['.svelte', '.md', '.svelte.md'],
  preprocess: [preprocess(), mdsvex({ extensions: ['.svelte.md', '.md', '.svx'] })],
  kit: {
    adapter: adapter(),
    files: {
      hooks: 'src/hooks',
    },
    vite: {
      define: {
        'process.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString()),
      },
      plugins: [vanillaExtractPlugin(), imagetools({ force: true })],
      ssr:
        process.env.NODE_ENV === 'development'
          ? {}
          : { noExternal: ['@vanilla-extract/css', '@vanilla-extract/css/fileScope'] },
    },
  },
};

export default config;
