// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // <-- Essential
    autoprefixer: {}, // <-- Essential
  },
};
export default config;