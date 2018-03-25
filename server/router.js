'use strict'

const path = require('path')
const Router = require('koa-router')
const koaBody = require('koa-body')
const router = new Router()
const moment = require('moment')
const Excel = require('exceljs')
const Stream = require('stream')
const util = require('./libs/util')
const request = require('request')
const xmlParser = require('./libs/koa-xml-body')

const check = require('./wechat/check')
const menu = require('./wechat/menu')

router.get('/', async (ctx) => {
  try {
    let data = await util.readFileAsync(path.join(__dirname, '../src/index.html'))
    ctx.type = 'html'
    ctx.body = data
  }
  catch (err) {
    ctx.body = {message: err.message}
    ctx.status = err.status || 500
  }
})
router.get('/MP_verify_ASHmayikOYnKBAss.txt', async (ctx) => {
  try {
    let _data = await readFile(path.join(__dirname, '../src/MP_verify_ASHmayikOYnKBAss.txt'))
    let data = String(_data)
    ctx.body = data
  }
  catch (err) {
    ctx.body = {message: err.message}
    ctx.status = err.status || 500
  }
})
router.get('/me', async (ctx) => {
  console.info(__dirname)
  let data = await readFile(path.join(__dirname, './config/wechat.txt'))
  let me = JSON.parse(data)
  ctx.body = me
})
router.get('/us', async (ctx) => {
  ctx.body = ctx._matchedRoute + '---' + ctx._matchedRouteName
})

router.get('/weixin', check)

router.post('/weixin',check, xmlParser({
  xmlOptions: {
    explicitRoot: false,
    explicitArray: false

  }
}), async (ctx) => {
  console.log(ctx.request.body)
  let message = ctx.request.body
  console.log(message)
  if(message.MsgType === 'event'){
    if(message.Event === 'subscribe'){
      let xml = util.tpl('I am pain and I need to be crazy and crazy and crazy', message)
      console.log(xml)
      ctx.status = 200
      ctx.type = 'application/xml'
      ctx.body = xml
    }
  }
  else{
    let xml = util.tpl('<abbb>wososo</abbb>', message)
    console.log(xml)
    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
  }
})

router.get('/menu',async (ctx)=>{
  let {action} = ctx.query
  console.log(action)
  if(action === 'create'){
    let response = await ctx.wechat.createMenu(menu)
    ctx.body = response
  }
  else if(action === 'get'){
    let response = await ctx.wechat.getMenu()
    ctx.body = response
  }
  else if(action === 'delete'){
    let response = await ctx.wechat.deleteMenu()
    ctx.body = response
  }
  else{
    ctx.body = 'we do nothing'
  }
})

function readFile (url) {
  return util.readFileAsync(url)
}


module.exports = router