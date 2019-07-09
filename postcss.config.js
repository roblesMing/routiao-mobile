// autoprefixer是自动加前缀
const { sep } = require('path')
module.exports = ({ file }) => {
  let rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1
    ? 37.5
    : 75
  return {
    plugins: {
      'autoprefixer': {
      },
      'postcss-pxtorem': {
        // 转化为rem的基准值
        rootValue,
        propList: ['*']
      }
    }
  }
}
