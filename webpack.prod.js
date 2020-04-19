const path=require("path");
const glob=require('glob');
const common=require("./webpack.common");
const merge=require("webpack-merge");
const fs=require('fs');
const {CleanWebpackPlugin}=require("clean-webpack-plugin");
const MiniCssExtractPlugin=require("mini-css-extract-plugin");
const HtmlWebpackPlugin=require("html-webpack-plugin");
const PurgecssPlugin=require('purgecss-webpack-plugin');

const PATHS={
    src: path.join(__dirname,'src')
};

function generateHtmlPlugins(templateDir,HTMLWebpackPlugin) {
    // Read files in template directory
    const templateFiles=walkDir(templateDir);
    return templateFiles.map(item => {
        // Split names and extension
        const parts=item.split('.');
        const name=parts[0];
        const extension=parts[1];
        // Create new HTMLWebpackPlugin with options
        return new HTMLWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname,`${templateDir}/${name}.${extension}`)
        });
    });
}

// Call our function on our views directory.
const htmlPlugins=generateHtmlPlugins('./src',HtmlWebpackPlugin);

// Function to walk through files and directories at a given path
function walkDir(rootDir) {
    const paths=[];
    // A recursive function
    // - If a path is a file it will add to an array to be returned
    // - If a path is a directory it will call itself on the directory
    function walk(directory,parent) {
        const dirPath=path.resolve(__dirname,directory);
        const templateFiles=fs.readdirSync(dirPath);

        // Check each path found, add files to array and call self on directories found
        templateFiles.forEach(file => {
            const filepath=path.resolve(__dirname,directory,file);
            const isDirectory=fs.lstatSync(filepath).isDirectory();

            if(isDirectory) {
                // File is a directory
                const subDirectory=path.join(directory,file);
                if(parent) {
                    // Join parent/file before passing so we have correct path
                    const parentPath=path.join(parent,file);
                    walk(subDirectory,parentPath);
                } else {
                    walk(subDirectory,file);
                }
            } else if(/\.html$/.test(file)) {
                if(parent) {
                    // Parent exists, join it with file to create the path
                    const fileWithParent=path.join(parent,file);
                    paths.push(fileWithParent);
                } else {
                    paths.push(file);
                }
            }
        });
    }

    // Start our function, it will call itself until there no paths left
    walk(rootDir);

    return paths;
}


module.exports=merge(common,{
    mode: "production",
    output: {
        filename: "public/[name].[contentHash].bundle.js",
        path: path.resolve(__dirname,"dist"),
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, //3. Extract css into files
                    {
                        loader: 'css-loader',options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader', //2. Turns css into commonjs
                    "sass-loader" //1. Turns sass into css
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({filename: "public/[name].[contentHash].css"}),
        // new PurgecssPlugin({
        //     paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true}),
        // }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: true
        })
    ].concat(htmlPlugins)
});
