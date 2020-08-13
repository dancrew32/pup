const puppeteer = require('puppeteer');
const faker = require('faker');

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  page.setUserAgent(faker.internet.userAgent());
  page.setJavaScriptEnabled(false)
  page.setViewport({
    width: 1024,
    height: 800,
    deviceScaleFactor: 1,
  });

  await page.setRequestInterception(true);
  page.on('request', (intercept) => {
    console.log(intercept.url());
    // intercept.abort();
    intercept.continue();
  });

  const site = 'https://news.ycombinator.com';
  await page.goto(site);
  await page.screenshot({path: `${encodeURIComponent(site)}.png`});
  const title = await page.evaluate(() => {
    return document.querySelector('title').textContent;
  });
  console.log(title);
  await browser.close();
})();
