var webpack = require("webpack");
var path = require("path");

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	context: __dirname,
	entry: {
		app: ["./src/app.jsx"],
	},
	output: {
	    path: path.resolve(__dirname, './build'),
	    filename: 'bundle.js'
	},
	recordsOutputPath: path.join(__dirname, "records.json"),
	module: {
        loaders: [
            { test: /\.js$/,     loader: ['babel-loader'], exclude: /node_modules/ },
            { test: /\.jsx$/,    loader: ['babel-loader'], exclude: /node_modules/ },
        		{ test: /\.json$/,   loader: "json-loader" },
        		{ test: /\.coffee$/, loader: "coffee-loader" },
        		{ test: /\.css$/,    loader: ExtractTextPlugin.extract("css-loader")},
        		{ test: /\.less$/,   loader: ExtractTextPlugin.extract("css-loader!less-loader")},
        		{ test: /\.scss$/,   loader: ExtractTextPlugin.extract("css-loader!sass-loader")},
        		{ test: /\.jade$/,   loader: "jade-loader?self" },
        		{ test: /\.png$/,    loader: "url-loader?prefix=images/&limit=5000" },
        		{ test: /\.jpg$/,    loader: "url-loader?prefix=images/&limit=5000" },
        		{ test: /\.gif$/,    loader: "url-loader?prefix=images/&limit=5000" },
        		{ test: /\.woff$/,   loader: "file-loader?name=fonts/[name].[ext]&prefix=fonts/&limit=5000&mimetype=application/font-woff" },
            { test: /\.woff2$/,  loader: "file-loader?name=fonts/[name].[ext]&prefix=fonts/&limit=5000&mimetype=application/font-woff2" },
        		{ test: /\.eot$/,    loader: "file-loader?name=fonts/[name].[ext]&prefix=fonts/&limit=5000" },
        		{ test: /\.ttf$/,    loader: "file-loader?name=fonts/[name].[ext]&prefix=fonts/&limit=5000" },
        		{ test: /\.svg$/,    loader: "file-loader?name=fonts/[name].[ext]&prefix=fonts/&limit=5000" },
        ]
	},
  externals: {
      'React': 'react',
      'ReactDOM': 'react-dom'
  },
  plugins: [
      new ExtractTextPlugin("./bundle.css")
  ],
  resolve: {
    modules: [
     "node_modules",
     path.resolve(__dirname, "src")
    ],

    extensions: [
      ".js",
      ".json",
      ".jsx",
      ".css",
      ".scss"
    ],

    alias: {
      Styles: path.resolve(__dirname, 'src/styles/'),
      Components: path.resolve(__dirname, 'src/components/'),
      Utils: path.resolve(__dirname, 'src/utils/'),
      Images: path.resolve(__dirname, 'images/'),
      Fonts: path.resolve(__dirname, 'fonts/'),
    }
  }
};
function escapeRegExpString(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
function pathToRegExp(p) { return new RegExp("^" + escapeRegExpString(p)); }