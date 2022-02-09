import preprocess from 'svelte-preprocess';
import 'dotenv/config';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {},
};

export default config;
