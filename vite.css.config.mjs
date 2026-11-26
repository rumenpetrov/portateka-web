import { patchCssModules } from "vite-css-modules";

export default {
  plugins: [
    patchCssModules({
      generateSourceTypes: true,
      declarationMap: true,
    }),
  ],
};
