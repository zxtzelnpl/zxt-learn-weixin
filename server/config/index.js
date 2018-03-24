const path = require('path')
const util=require('../libs/util')
const wechat_file = path.join(__dirname,'./wechat.txt')
module.exports = {
  mysql: {
    host: '121.40.163.176',
    user: 'root',
    password: 'vcl111111',
    database: 'tx_securities'
  },
  wechat: {
    appID: 'wx17553b6801759908',
    appSecret: 'f122296e37abf10ba55a8746a90fdd15',
    token: 'zhaoxuetong',
    getAccessToken: function () {
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken: function (data) {
      let _data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file, _data)
    }
  },
  session: {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
  }
}
