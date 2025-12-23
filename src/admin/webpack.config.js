const HtmlWebpackPlugin = require("html-webpack-plugin");
const writeHeadlockrClientFiles = require("@headlockr/headlockr/client");

module.exports = (config) => {
  config.plugins = config.plugins.map((plugin) => {
    if (plugin instanceof HtmlWebpackPlugin) {
      return new HtmlWebpackPlugin({
        template: ".headlockr/client/index.html",
        inject: true,
      });
    }
  return plugin;
});

config.entry.main.push("./.headlockr/client/headlockr-admin-panel.tsx");

config.plugins.push({
  apply: (compiler) => {
    let alreadyExecuted = false;

    compiler.hooks.beforeCompile.tapPromise(
      "GenerateHeadlockrFiles",
      async () => {
        if (alreadyExecuted) return;
        alreadyExecuted = true;

        console.log("Generating Headlockr runtime files...");

        await writeHeadlockrClientFiles({
          runtimeDir: ".headlockr/client",
          logger: console,
        });

        console.log("Headlockr runtime files generated successfully.");
      },
    );
  },
});

// Important: return the modified config
return config;
};
