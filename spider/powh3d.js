const puppeteer = require('puppeteer');
const sendDingtalkMsg = require('../common/dingdingbot')
const moment = require('moment')
const priceMap = {}
const fetchPowhData = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 60000
  });
  const page = await browser.newPage();
  let buyPrice
  let sellPrice
  let url = 'https://powh.trade/mypowh.php'
  await page.goto(url);
  await page.mainFrame().waitForSelector('.container')
  const watchDog = page.mainFrame().waitForFunction("document.querySelectorAll('#buyP')[0].innerText !== '0 ETH' && document.querySelectorAll('#sellP')[0].innerText !== '0 ETH'")
  await watchDog
  let data = await page.evaluate(() => {
    let buyPrice = document.querySelectorAll('#buyP')[0].innerText
    let sellPrice = document.querySelectorAll('#sellP')[0].innerText
    return  {
      buyPrice: buyPrice.split(' ')[0],
      sellPrice: sellPrice.split(' ')[0],
    }
  });
  console.log('buyPrice is ' + data.buyPrice)
  console.log('sellPrice is ' + data.sellPrice)
  await processData(data)
  browser.close()
}

const processData = async (data) => {
  const timestamp = (new Date()).getMinutes()
  let last1m = timestamp - 1
  let last1mRate = 0
  let last10mRate = 0
  if (timestamp === 0) {
    last1m = 59
  }
  let last10m = timestamp - 10
  if (timestamp < 10) {
    last10m = 50 + timestamp
  }
  if (priceMap[last1m]) {
    last1mRate = (data.sellPrice - priceMap[last1m].sellPrice) / priceMap[last1m].sellPrice
  }
  if (priceMap[last10m]) {
    last10mRate = (data.sellPrice - priceMap[last10m].sellPrice) / priceMap[last10m].sellPrice
  }
  priceMap[timestamp] = data
  if (Math.abs(last1mRate) > 1 || Math.abs(last10mRate) > 5) {
    let msg = `当前买入价格：${data.sellPrice}, 当前卖出价格：${data.sellPrice}\n 卖出价1分钟变化：${last1mRate * 100}%, 卖出价10分钟变化：${last10mRate * 100}%, `
    await sendDingtalkMsg('https://oapi.dingtalk.com/robot/send?access_token=1e7fc7f14ce2524c501212566b46e224a1b11db94fb0c8edf77d0cea18f8f20a', msg)
  }
}
fetchPowhData()
setInterval(() => {
  fetchPowhData()
}, 60*1000)