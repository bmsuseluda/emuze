module.exports = {
  presets: [
    ["@babel/preset-env", { useBuiltIns: "entry", corejs: 3, loose: true }],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/preset-typescript",
  ],
};
