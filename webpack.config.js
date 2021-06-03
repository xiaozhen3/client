const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成html文件的插件
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
module.exports={ 
    mode:isProduction?'production':'development' ,
    entry:'./src/index.tsx',
    output:{
        path:path.join(__dirname,'dist'),// 打包后的输出目录
        filename: 'main.js' // 打包后的js文件名
    },
    devtool:'source-map', // 生成单独的完整的source-map文件，方便调试
    devServer:{
        port:8000, // 开发服务器的端口号
        hot:true, // 启动热更新 
        contentBase:path.join(__dirname,'public'), // 静态文件根目录
        historyApiFallback:{  // 因为我们可能会使用浏览器路由，刷新的时候需要重定向到根目录
            index:'./index.html'
        }
    },
    // 配置解析器
    resolve:{
        alias:{// 别名，配置解析的别名，方便我们编写引入的路径
            '@':path.resolve(__dirname,'src'),
            '~':path.resolve(__dirname,'node_modules')
        },// 查找模板的时候的扩展名
        extensions:['.ts','.tsx','.js','.jsx','.json']
    },
    module:{//模块解析器
        rules:[ // 规则
            {
                test:/\.(j|t)sx?/,
                loader:'babel-loader',
                options:{
                    presets:[
                        "@babel/preset-env",
                        "@babel/preset-react",
                        "@babel/preset-typescript"
                    ],
                    plugins:[
                        ['import',{libraryName:'antd',style:'css'}]
                    ]
                },
                include:path.resolve('src'),
                exclude:/node_modules/
            },
            {
                test:/\.css$/,
                use:[
                    isProduction?miniCssExtractPlugin.loader:"style-loader",
                    {
                        loader:'css-loader'
                    }
                ]
            },
            {
                test:/\.less$/,
                use:[
                    isProduction?miniCssExtractPlugin.loader:"style-loader",
                    {
                        loader:'css-loader',
                        options:{importLoaders:3}
                    },
                    {
                        loader:'postcss-loader', // 加入厂商的兼容性前缀
                        options:{
                            postcssOptions:{
                                plugins:['autoprefixer']
                            }
                        }
                    },
                    {
                        loader:'px2rem-loader',
                        options:{
                            remUnit:75, // 1rem对应的是75px
                            remPrecesion:8 // 计算后的小树精度是8位
                        }
                    },
                    "less-loader" // 把less编译成css
                ]
            },
            {
                test:/\.(jpg|png|gif|svg|jpeg)/,
                type:'asset' // 以前url-loader或者file-loader，现在不需要了，webpack5内置支持
            }
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}