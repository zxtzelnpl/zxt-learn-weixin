'use strict'

const path = require('path');
const Koa=require('koa')
const util = require('./libs/util')

const wechat = require('./wechat/g')

const wechat_file = path.join(__dirname,'./config/wechat.txt')

const config={
  wechat:{
    appID:'wx17553b6801759908',
    appSecret:'f122296e37abf10ba55a8746a90fdd15',
    token:'zhaoxuetong',
    getAccessToken:function(){
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken:function(data){
      let _data = JSON.stringify(data)
      console.log('########_data########')
      console.log(_data)
      console.log('########_data########')
      return util.writeFileAsync(wechat_file,_data)
    }
  }
}


const app=new Koa()

app.use(wechat(config.wechat))

app.listen(1234)
console.log('Listening:1234')