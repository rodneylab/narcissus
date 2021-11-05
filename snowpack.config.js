// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'node_modules/@fontsource/slabo-27px/files': '/files',
  },
  plugins: ['@vanilla-extract/snowpack-plugin', '@snowpack/plugin-dotenv'],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
