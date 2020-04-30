module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '0.6',
        },
      },
    ],
  ],
  parserOpts: {
    allowReturnOutsideFunction: true,
  },
  plugins: ['@babel/plugin-transform-runtime'],
};
