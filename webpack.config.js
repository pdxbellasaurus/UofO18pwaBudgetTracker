const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: "/public/assets/js/index.js",
  output: {
    path: __dirname + "/public/dist",
    publicPath: "/dist",
    filename: "bundle.js"
  },
  mode: "production",
  plugins: [
    new WebpackPwaManifest({

      filename: "manifest.json",
      inject: false,
      fingerprints: false,

      name: "Budget Tracker",
      short_name: "Budget Tracker",
      theme_color: "#317EFB",
      background_color: "#ffffff",
      start_url: "./",
      display: "standalone",

      icons: [
        {
          src: path.resolve('public/assets/images/icons/icon-512x512.png'
            ),
          size: [72, 96, 128, 144, 152, 192, 384, 512]
        }
      ]
    })
  ]
};

module.exports = config;