不应编辑生成的源文件, 重新生成时, 更改将丢失

你遇到的这个提示，通常是在 React 项目中编辑了 node_modules 目录下或通过工具自动生成的文件（比如 react-scripts 生成的配置文件）时出现的，核心原因是这些文件属于「自动生成的源文件」，项目重新构建（如 npm run build）或依赖重新安装时，你的修改会被自动覆盖。
为什么会有这个提示？
React 等前端框架或工具（如 create-react-app）会自动生成一些底层配置文件（如 Webpack、Babel 配置），并将它们隐藏在 node_modules 或特定目录中，目的是简化开发者的配置工作。这些文件的设计初衷就是「只读」或「由工具管理」，而非手动修改。
正确的解决思路（避免直接修改生成文件）
如果需要自定义配置（比如修改 Webpack 规则、添加 Babel 插件等），应该通过以下「安全方式」实现，避免手动编辑生成文件：
1. 对于 create-react-app 生成的项目（使用 react-scripts）
   方法 1：使用 eject 暴露配置文件（不可逆）
   运行以下命令，将隐藏的配置文件（Webpack、Babel 等）提取到项目根目录的 config 和 scripts 文件夹中，之后就可以安全编辑这些文件（修改后不会被覆盖）：
   bash
   npm run eject

⚠️ 注意：eject 是不可逆操作，执行后无法恢复，适合需要深度定制的项目。
方法 2：使用第三方工具扩展配置（推荐）
无需 eject，通过 react-app-rewired 等工具扩展配置，比如：
安装依赖：
bash
npm install react-app-rewired customize-cra --save-dev

在项目根目录创建 config-overrides.js 文件，在此文件中编写自定义配置（例如修改 Webpack 规则）：
javascript
// config-overrides.js 示例：添加自定义 loader
const { override, addWebpackModuleRule } = require('customize-cra');
module.exports = override(
addWebpackModuleRule({
test: /\.txt$/,
use: 'raw-loader'
})
);

修改 package.json 中的 scripts，用 react-app-rewired 替代 react-scripts：
json
{
"scripts": {
"start": "react-app-rewired start",
"build": "react-app-rewired build",
"test": "react-app-rewired test"
}
}

这种方式不会修改生成文件，且配置会被永久保留。
2. 对于其他工具生成的文件（如 node_modules 中的依赖）
   如果需要修改第三方依赖的源码（不推荐，尽量通过官方配置解决），可以使用 patch-package 工具给依赖打「补丁」，避免重新安装时丢失修改：

安装工具：
bash
npm install patch-package --save-dev

手动修改 node_modules 中的目标文件（比如 node_modules/xxx/package/index.js）。
生成补丁文件：
bash
npx patch-package xxx  # xxx 是依赖的包名


项目根目录会生成 patches/xxx+版本.patch 文件，提交到代码仓库。之后重新安装依赖时，补丁会自动生效。
总结
核心原则：永远不要直接编辑自动生成的源文件或 node_modules 中的文件，而是通过工具提供的「扩展机制」（如 eject、react-app-rewired）或「补丁工具」（如 patch-package）实现自定义，这样才能保证修改在重新生成 / 安装时不丢失。