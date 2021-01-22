const { NODE_ENV } = process.env;

module.exports = {
  presets: [
    '@babel/typescript',
    [
      '@babel/env',
      {
        targets: {
          browsers: ['ie >= 11']
        },
        exclude: ['transform-async-to-generator', 'transform-regenerator'],
        modules: false,
        loose: true
      }
    ]
  ],
  plugins: [
    '@babel/proposal-class-properties',
    // don't use `loose` mode here - need to copy symbols when spreading
    '@babel/proposal-object-rest-spread',
    ['@quickbaseoss/babel-plugin-styled-components-css-namespace', { cssNamespace: 'stackend' }],
    [
      'babel-plugin-styled-components',
      {
        displayName: true,
        ssr: true
      }
    ],
    NODE_ENV === 'test' && '@babel/transform-modules-commonjs'
  ].filter(Boolean)
};
