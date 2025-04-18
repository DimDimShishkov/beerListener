const puppeteer = require("puppeteer-core");
const editBarDB = require("./db");

async function getTitleByUrl(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { timeout: 0, waitUntil: "networkidle0" });
  const title = await page.evaluate(() => document.title);

  if (title) {
    console.log(title);
  } else {
    throw Error("Unable to take screenshot");
  }

  await page.close();
  await browser.close();

  return title
    ? String(title).replace(", Москва — Яндекс Карты", "")
    : "не вышло";
}

async function addBar(msgTxt) {
  //обработка сообщения для разработки
  if (msgTxt.match(/#место_dev/gi)) {
    const [tag, name, url, ...rest] = String(msgTxt).split(" ");
    editBarDB(name, url, true);
    return { err: false, name, url };
  }

  // регулярка "https://"
  const regex = /https:\/\/[^\s]+/;
  const urls = msgTxt.match(regex);

  if (!urls)
    return {
      err: true,
      name: "произошла ошибка, добавьте место через dev",
      url: "",
    };

  const name = await getTitleByUrl(urls[0]);
  if (name) {
    editBarDB(name, url, true);
  }
  return { err: false, name, url: urls[0] };
}

module.exports = addBar;
