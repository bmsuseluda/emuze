module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: 100,
        },
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
};
