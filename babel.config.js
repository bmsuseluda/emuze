module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: 134,
        },
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
};
