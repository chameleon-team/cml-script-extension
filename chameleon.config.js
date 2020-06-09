
// 设置静态资源的线上路径
const publicPath = '//www.static.chameleon.com/cml';
// 设置api请求前缀
const apiPrefix = 'https://api.chameleon.com';
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

cml.config.merge({
  templateLang: "cml",
  templateType: "html",
  platforms: ["web","weex","wx","alipay","baidu","qq"],
  buildInfo: {
    wxAppId: '123456'
  },
  wx: {
    dev: {
    },
    build: {
      apiPrefix
    }
  },
  web: {
    dev: {
      analysis: false,
      console: false,
      isWrapComponent: false // 取消默认对组件的包裹
    },
    build: {
      analysis: false,
      publicPath: `${publicPath}/web/`,
      apiPrefix,
      isWrapComponent: false // 取消默认对组件的包裹
    }
  },
  weex: {
    dev: {
      isWrapComponent: false // 取消默认对组件的包裹
    },
    build: {
      publicPath: `${publicPath}/weex/`,
      apiPrefix,
      isWrapComponent: false // 取消默认对组件的包裹
    },
    custom: {
      publicPath: `${publicPath}/wx/`,
      apiPrefix
    }
  },
  optimize: {
    watchNodeModules: true, // 设置为true对于调试 node_modules 里面的内容很有帮助
  }
});

cml.utils.plugin('webpackConfig', function({ type, media, webpackConfig }, cb) {
  // cb函数用于设置修改后的配置
  debugger;
  const extHtmlWebpackPlugin = new ScriptExtHtmlWebpackPlugin({
    custom: {
      test: /\.js$/,
      attribute: 'crossorigin',
      value: 'anonymous'
    }
  });
  if(type === 'web'){
    let HtmlWebpackPluginIndex = webpackConfig.plugins.findIndex((plugin) => {
      return plugin.constructor && plugin.constructor.name === 'HtmlWebpackPlugin'
    });
    webpackConfig.plugins.splice(HtmlWebpackPluginIndex+1,0,extHtmlWebpackPlugin);
  }
  cb({
    type,
    media,
    webpackConfig
  });
});

