module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "expo-router/babel",
      [
        "module-resolver",
        {
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          alias: {
            "@sticker/theme": "../../packages/theme/src",
            "@sticker/ui": "../../packages/ui/src",
            "@sticker/core": "../../packages/core/src"
          }
        }
      ],
      "react-native-reanimated/plugin"
    ]
  };
};
