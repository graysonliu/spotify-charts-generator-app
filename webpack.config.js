const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default;
const dotenv = require('dotenv')
const fs = require('fs');
const os = require('os');

module.exports = async (env, argv) => {
    const paths = ['/spotify-charts-generator-app'];
    const isDevelopment = argv.mode === 'development';

    // get LAN address for testing on other devices
    let lan_address = null;
    if (isDevelopment) {
        const interfaces = os.networkInterfaces();
        for (const key in interfaces) {
            if (key.indexOf('eth') === 0 || key.indexOf('wlo') === 0 || key.indexOf('wifi') === 0) {
                for (const ipInfo of interfaces[key]) {
                    const address = ipInfo.address;
                    const netmask = ipInfo.netmask;
                    if (netmask === '255.255.255.0' && address.indexOf('192.168.') === 0) {
                        lan_address = address;
                        break
                    }
                }
            }
            if (lan_address)
                break;
        }
    }

    const config = {
        entry: {
            index: "./src/index.jsx",
        },
        mode: isDevelopment ? 'development' : 'production',
        devtool: isDevelopment ? 'inline-source-map' : 'source-map',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/i,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: {
                                presets: ["@babel/env"],
                                plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean)
                            }
                        }]
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ["style-loader", "css-loader", "sass-loader"]
                },
                {
                    test: /\.(pdf|svg)$/i,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    }
                },
                {
                    test: /\.(txt|html)$/i,
                    use: 'raw-loader'
                }
            ]
        },
        resolve: { extensions: ["*", ".js", ".jsx"] },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.js',
        },
        devServer: {
            contentBase: path.join(__dirname, ""),
            port: 3001,
            host: '0.0.0.0',
            hotOnly: true
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': JSON.stringify(dotenv.config().parsed)
            }),
            isDevelopment && new webpack.HotModuleReplacementPlugin(),
            isDevelopment && new ReactRefreshWebpackPlugin(),
            !isDevelopment && new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "./src/template.ejs",
                title: "Spotify Charts Generator",
                favicon: "./src/images/thinking.svg",
                meta: [
                    {
                        name: 'viewport',
                        content: 'width=device-width, initial-scale=1'
                    }
                ],
                // for Google Analytics
                googleAnalytics: {
                    measurement_id: 'G-LR3X62X1VR'
                },
                // inject environment variables into pages at build time
                window: {
                    env: {
                        server_uri:
                            isDevelopment ?
                                'http://' + lan_address + ':3000' :
                                process.env.SERVER_URI,
                    }
                },
            }),
            new SitemapWebpackPlugin('https://graysonliu.github.io', paths,
                { skipgzip: true })
        ].filter(Boolean)
    };

    // for HTTPS
    // if (isDevelopment)
    //     config.devServer = {
    //         ...config.devServer,
    //         https: true,
    //         key: fs.readFileSync('key.pem'),
    //         cert: fs.readFileSync('cert.pem'),
    //     }
    return config;
};
