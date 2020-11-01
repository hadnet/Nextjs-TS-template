/* eslint-disable @typescript-eslint/no-var-requires */
const withLess = require('@zeit/next-less');
const withSass = require('@zeit/next-sass');
const withPlugins = require('next-compose-plugins');
const path = require('path');
const generateTheme = require('next-dynamic-antd-theme/plugin');
const cssLoaderGetLocalIdent = require('css-loader/dist/utils').defaultGetLocalIdent;
const withTM = require('next-transpile-modules');
const withCss = require('@zeit/next-css');
const {primaryColor} = require('./styles/themeColors');

const prod = process.env.NODE_ENV === 'production';
const prefix = prod ? '/' : '/';

const withAntdTheme = generateTheme({
  antDir: path.join(__dirname, './node_modules/antd'),
  stylesDir: path.join(__dirname, './styles/theme'),
  varFile: path.join(__dirname, './styles/theme/vars.less'),
  outputFilePath: path.join(__dirname, './.next/static/color.less'),
  lessFilePath: `${prefix}_next/static/color.less`,
  lessJSPath: 'https://cdnjs.cloudflare.com/ajax/libs/less.js/3.12.2/less.min.js',
  customThemes: {dark: {'@primary-color': primaryColor}, default: {'@primary-color': primaryColor}},
});

withAntd = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    lessLoaderOptions: {
      javascriptEnabled: true,
    },
    cssModules: true,
    cssLoaderOptions: {
      camelCase: true,
      localIdentName: '[local]___[hash:base64:5]',
      getLocalIdent: (context, localIdentName, localName, options) => {
        let hz = context.resourcePath.replace(context.rootContext, '');
        if (/node_modules/.test(hz)) {
          return localName;
        } else {
          return cssLoaderGetLocalIdent(context, localIdentName, localName, options);
        }
      },
    },
    webpack(config, options) {
      if (config.externals) {
        const includes = [/antd/];
        config.externals = config.externals.map(external => {
          if (typeof external !== 'function') return external;
          return (ctx, req, cb) => {
            return includes.find(include =>
              req.startsWith('.') ? include.test(path.resolve(ctx, req)) : include.test(req),
            )
              ? cb()
              : external(ctx, req, cb);
          };
        });
      }

      return typeof nextConfig.webpack === 'function' ? nextConfig.webpack(config, options) : config;
    },
  });
};

module.exports = withPlugins([withAntd, withLess, withTM, withSass, withCss, withAntdTheme], {
  serverRuntimeConfig: {},
  assetPrefix: prefix,
  webpack: (config, options) => {
    // config.node = { fs: 'empty' };
    return config;
  },
});
