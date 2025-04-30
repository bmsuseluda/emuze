module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: 136,
        },
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
};
