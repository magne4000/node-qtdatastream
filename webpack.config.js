var webpack = require('webpack');
var path = require('path');
var nodeExternals = require('webpack-node-externals');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = function getConfig(options){

  options = options || {};

  var isProd = (options.BUILD_ENV || process.env.BUILD_ENV) === 'PROD';
  var isWeb = (options.TARGET_ENV || process.env.TARGET_ENV) === 'WEB';

  // get library details from JSON config
  var packagejson = require('./package.json');
  var libraryName = packagejson.name;

  // determine output file name
  var outputName = buildLibraryOutputName(libraryName, isProd);
  var outputFolder = isWeb ? 'dist' : 'lib';

  // get base config
  var config;

  // for the web
  if(isWeb){
    config = Object.assign({}, getBaseConfig(isProd), {
      output: {
        path: path.join(__dirname, outputFolder),
        filename: outputName,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
      }
    });
  }

  // for the backend
  else {
    config = Object.assign({}, getBaseConfig(isProd), {
      output: {
        path: path.join(__dirname, outputFolder),
        filename: outputName,
        library: libraryName,
        libraryTarget: 'commonjs2'
      },
      target: 'node',
      node: {
        __dirname: true,
        __filename: true
      },
      externals: [nodeExternals()]
    });
  }

  config.plugins.push(new CleanWebpackPlugin([outputFolder]));

  return config;
};

/**
 * Build base config
 * @param  {Boolean} isProd [description]
 * @return {[type]}         [description]
 */
function getBaseConfig(isProd) {

  var libraryEntryPoint = 'index.js';

  // generate webpack base config
  return {
    entry: path.join(__dirname, libraryEntryPoint),
    output: {
      // ommitted - will be filled according to target env
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|test)/,
        loader: "babel-loader"
      }]
    },
    resolve: {
      modules: [
        path.join(__dirname, "src"), "node_modules"
      ],
      extensions: ['.js']
    },
    devtool: isProd ? false : '#source-map',
    plugins: isProd ? [
      new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"production"'}}),
      new UglifyJsPlugin({ minimize: true })
      // Prod plugins here
    ] : [
      new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"development"'}})
      // Dev plugins here
    ]
  };
}

function buildLibraryOutputName(libraryName, isProd){
  return [libraryName, (isProd ? 'min.js' : 'js')].join('.');
}