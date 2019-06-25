const Router = require('koa-router')
const router = new Router({ prefix: '/crawlers' })
const { popularCrawlers } = require('../crawlers/index')
popularCrawlers()

router.get('/popularTop100', async ctx => {
  ctx.body = {
    msg: 'success'
    // result
  }
})

module.exports = router
