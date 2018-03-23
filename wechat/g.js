'use strict'
const sha1 = require('sha1')
const __request = require('request');
const request = function(obj){
  return new Promise(function(resolve,reject){
    __request(obj,function(err,response,body){
      console.log('#####request in Promise#####')
      console.log(err)
      console.log(response)
      console.log(body)
      console.log('#####request in Promise#####')
      if(err){reject(err)}
      resolve(body)
    })
  })
}

const prefix = 'https://api.weixin.qq.com/cgi-bin/token?'
const api = {
  accessToken:prefix+'grant_type=client_credential'
}
function Wechat(opts) {
  let that = this
  this.appID = opts.appID
  this.appSecret = opts.appSecret
  this.getAccessToken = opts.getAccessToken
  this.saveAccessToken = opts.saveAccessToken

  this
    .getAccessToken()
    .then(function (data) {
      try {
        data = JSON.parse(data)
      }
      catch (e) {
        return that.updateAccessToken(data)
      }

      if (that.isValidAccessToken(data)) {
        return Promise.resolve(data)
      }
      else {
        return that.updateAccessToken()
      }
    })
    .then(function (data) {
      that.access_token = data.access_token
      that.expires_in = data.expires_in

      that.saveAccessToken(data)
    })
}

Wechat.prototype.isValidAccessToken = function(data){
  if(!data||!data.access_token||!data.expires_in){
    return false
  }

  let access_token = data.access_token
  let expires_in = data.expires_in
  let now = (new Date().getTime())

  return now < expires_in;

}

Wechat.prototype.updateAccessToken = function(){
  let appID=this.appID
  let appSecret=this.appSecret
  let url = api.accessToken + '&appid='+appID + '&secret=' + appSecret

  return new Promise(function(resolve,reject){
    request({url:url,json:true})
      .then(function(response){
        let data = response[1]
        let now = (new Date()).getTime()

        data.expires_in = now +(data.expires_in-20)*1000
        resolve(data)
      })
  })

}

module.exports = function (opts) {
  let wechat = new Wechat(opts)

  return function* (next) {
    console.log(this.query)

    let token = opts.token
    let signature = this.query.signature
    let nonce = this.query.nonce
    let timestamp = this.query.timestamp
    let echostr = this.query.echostr

    let str = [token, timestamp, nonce].sort().join('')

    let sha = sha1(str)

    if (sha === signature) {
      this.body = echostr
    }
    else {
      this.body = 'wrong'
    }
  }
}