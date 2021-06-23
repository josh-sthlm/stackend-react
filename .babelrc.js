const { NODE_ENV } = process.env;

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: ['ie >= 11'],
          node: '12.19'
        },
        exclude: ['transform-async-to-generator', 'transform-regenerator'],
        modules: false,
        loose: true
      }
    ],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    ['@babel/plugin-proposal-private-methods', { loose: false }],
    /* Version 1 produces code that does not work */
    ['@quickbaseoss/babel-plugin-styled-components-css-namespace', { cssNamespace: 'stackend' }],
    [
      'babel-plugin-styled-components',
      {
        minify: false,
        displayName: true,
        ssr: true
      }
    ],
    '@babel/transform-modules-commonjs'
  ]
};
