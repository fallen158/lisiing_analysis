const puppeter = require('puppeteer')
const path = require('path')
const chalk = require('chalk')
const log = console.log
const TOTAL_PAGE = 10
// const fs = require('fs')
const { popularTop100 } = require('../controllers/crawler')

// 热门楼盘TOP100爬取
async function popularCrawlers () {
  const browser = await puppeter.launch({
    headless: false,
    executablePath: path.join(
      '/Users/dahaojiang/Documents/常用工具/chrome-mac/Chromium.app/Contents/MacOS/Chromium'
    )
  })
  log(chalk.green('服务正常启动'))
  const page = (await browser.pages())[0]
  page.on('close', msg => {
    log(chalk.blue(msg))
  })
  await page.setViewport({ width: 1200, height: 800 })
  try {
    await page.goto(
      'https://cq.newhouse.fang.com/asp/trans/buynewhouse/default.htm'
    )
    log(chalk.yellow('页面初次加载完毕'))
    for (let i = 1; i < TOTAL_PAGE; i++) {
      // 等待分页按钮出现
      await page.waitForSelector('.floatr>a')
      // 找到分页跳转按钮
      const pageSubmit = await page.$$('.floatr>a')
      // 跳转页面
      await pageSubmit[i].click()
      // 等待页面加载完毕
      await page.waitFor(1500)
      console.clear()
      log(chalk.yellow('页面数据加载完毕'))
      // 处理数据
      await handlePageDate()
      // 一个页面爬完等待一会，不然太快会把你当成机器人弹出验证码
      await page.waitFor(1500)
    }
    await page.close()
  } catch (error) {
    log(chalk.red('服务器异常'))
    await page.close()
    throw new Error(error)
  }

  async function handlePageDate () {
    const result = await page.evaluate(() => {
      let $ = window.$
      let items = $('.listArea> ul>li')
      if (items && items.length > 1) {
        let movies = []
        items.each((index, item) => {
          let it = $(item)
          let title = it.find('.img>.text>p>a').text()
          let area = it.find('.img>.text>p>span').text()
          let url = 'https:' + it.find('.img>a').attr('href')
          area = area.replace(/\[|\]/g, '')
          let address = it.find('.imgInfo>.address>a').text()
          let price = it.find('.imgInfo>.price').text()
          price = price.trim()
          let comment = it.find('.imgInfo>.comment>a').text()
          comment = comment.replace(/\(|\)/g, '')
          let tags = it.find('.imgInfo>.tag>span').text()
          tags = tags.replace(/\n\t\r/g, '')
          let roomType = it
            .find('.imgInfo>.comment')
            .next()
            .text()
          roomType = roomType.replace(/\t|\n/g, '')
          movies.push({
            title,
            area,
            address,
            price,
            comment,
            tags,
            roomType,
            url
          })
        })
        return movies
      }
    })
    // const pageDataStream = fs.createWriteStream('popular_property.json', {
    //   flags: 'a'
    // })
    // pageDataStream.write(JSON.stringify(result), () => {
    //   log(chalk.red('数据添加完毕'))
    // })
    result.map(async v => {
      await popularTop100(v)
    })
  }
}

module.exports = {
  popularCrawlers
}
