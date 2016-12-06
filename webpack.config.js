export const webpackScripts = {
  entry: `./app/index.jsx`,
  output: {
    path: `./dist`,
    filename: `app.js`
  },
  module: {
    loaders: [{
      test: /\.(jsx|js)$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015']
      }
    }]
  }
};