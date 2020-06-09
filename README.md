title：CML项目下如何增强HTML Webpack Plugin的使用？
---

## 背景

某些场景下，我们需要在 html-webpack-plugin 生成的 html 文件中的 script 标签上增加某些属性，比如 async defer 等等，由于 该插件没有提供对应的能力，我们需要使用某些手段增强该插件能力

比如 [script-ext-html-webpack-plugin](https://www.npmjs.com/package/script-ext-html-webpack-plugin) 这个插件就提供了这样的能力。

具体其他配置参考[官网](https://www.npmjs.com/package/script-ext-html-webpack-plugin)

## CML项目中如何使用

需要注意点就是

`The order is important - the plugin（script-ext-html-webpack-plugin）must come after HtmlWebpackPlugin.`

也就是说 `script-ext-html-webpack-plugin` 插件必须在 webpack 配置的插件数组中 HtmlWebpackPlugin 插件之后；

### 第一步，安装改插件
```
npm install script-ext-html-webpack-plugin@1.8.8

```

### 第二步，修改`chameleon.config.js`

```javascript
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
//...
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
```

`cml web build` 之后查看构建结果

```html
<script type="text/javascript" src="//www.static.chameleon.com/cml/web/static/js/manifest_3cbfbd4a61bd303d57dc.js" crossorigin="anonymous"></script>

<script type="text/javascript" src="//www.static.chameleon.com/cml/web/static/js/vender_904bcc7cfa7b18b85ac0.js" crossorigin="anonymous"></script>

<script type="text/javascript" src="//www.static.chameleon.com/cml/web/static/js/cml-script-extension_091bce493315100f43ad.js" crossorigin="anonymous"></script>
```

可以发现会在 script 标签上增加了 `crossorigin="anonymous"` 属性。






