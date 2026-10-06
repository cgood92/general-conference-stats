const path = require("node:path");
const { CracoAliasPlugin } = require("react-app-alias-ex");

module.exports = {
  webpack: {
    configure: (config) => {
      // Search pages need talk text; structured citation evidence is served by Insights.
      config.module.rules.push({
        test: /\.json$/,
        include: path.resolve(__dirname, "../case2/output"),
        enforce: "pre",
        use: path.resolve(__dirname, "talk-text-loader.cjs"),
      });
      return config;
    },
  },
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {},
    },
  ],
};
