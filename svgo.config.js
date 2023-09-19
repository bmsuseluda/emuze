module.exports = {
  plugins: [
    // set of built-in plugins enabled by default
    {
      name: "preset-default",
      params: {
        overrides: {
          // customize default plugin options
          removeViewBox: false,
          convertColors: {
            currentColor: true,
          },
        },
      },
    },

    // enable built-in plugins by name
    "prefixIds",

    // or by expanded notation which allows to configure plugin
    {
      name: "sortAttrs",
      params: {
        xmlnsOrder: "alphabetical",
      },
    },
    {
      name: "convertColors",
      params: {
        currentColor: "true",
      },
    },
    {
      name: "removeUselessStrokeAndFill",
      params: {
        removeUselessStrokeAndFill: "true",
      },
    },
    {
      name: "addAttributesToSVGElement",
      params: {
        attributes: [
          { fill: "currentColor" },
          { stroke: "currentColor" },
          { "stroke-width": 0 },
        ],
      },
    },
  ],
};
