const path = require('path');

module.exports = {
  entry: './static/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, "static"),
    library : "kevin",
  },
  mode : "development",
};