const puppeteer = require("puppeteer-core");

//TODO заменить на обращение к БД
const fs = require("fs");
const path = require("path");

// получаем название бара из URL
async function getTitleByUrl(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, {waitUntil: "networkidle0", timeout: 3000});
  } catch (e) {}

  await page.content();

  const title = await page.evaluate(() => document.title);

  await browser.close();
  //TODO как будет время посмотреть почему replace без String(title) не работает
  return title ? String(title).replace(", Москва — Яндекс Карты", "") : "не вышло";
}

//TODO заменить на обращение к БД
function addBarToDB(name, url) {
  const database = path.resolve(__dirname, "./database.json");
  const databaseJson = JSON.parse(fs.readFileSync(database, "utf8"));

  const bars = [...databaseJson.bars, {name, url}];

  fs.writeFileSync(database, JSON.stringify({bars, users: databaseJson.users}));
}

module.exports.addBar = async (msgTxt) => {
  //обработка сообщения для разработки
  if (msgTxt.match(/#место_dev/gi)) {
    const [tag, name, url, ...rest] = String(msgTxt).split(" ");
    addBarToDB(name, url);
    return {err: false, name, url};
  }

  // регулярка "https://"
  const regex = /https:\/\/[^\s]+/;
  const urls = msgTxt.match(regex);

  //TODO заменить console.log на возвращение сообщения в чат"

  if (!urls)
    return {
      err: true,
      name: "произошла ошибка, добавьте место через dev",
      url: "",
    };

  const name = await getTitleByUrl(urls[0]);

  if (name) {
    addBarToDB(name, urls[0]);
  }

  return {err: false, name, url: urls[0]};
};

