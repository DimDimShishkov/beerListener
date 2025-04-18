const puppeteer = require("puppeteer-core");

//TODO заменить на обращение к БД
const fs = require("fs");
const path = require("path");

async function getTitleByUrl(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { timeout: 0, waitUntil: "networkidle0" });
  const screenData = await page.evaluate(() => document.title);

  if (!!screenData) {
    fs.writeFileSync("screenshots/screenshot.jpg", screenData);
  } else {
    throw Error("Unable to take screenshot");
  }

  await page.close();
  await browser.close();
}

// получаем название бара из URL
async function getTitleByUrl(url) {
  await page.goto(url, { timeout: 0, waitUntil: "networkidle0" });
  // await page.content();

  const title = await page.evaluate(() => document.title);

  await page.close();
  await browser.close();

  console.log(title);

  //TODO как будет время посмотреть почему replace без String(title) не работает
  // return "";
  return title
    ? String(title).replace(", Москва — Яндекс Карты", "")
    : "не вышло";
}

//TODO заменить на обращение к БД
function addBarToDB(name, url) {
  const database = path.resolve(__dirname, "./database.json");
  const databaseJson = JSON.parse(fs.readFileSync(database, "utf8"));

  const bars = [...databaseJson.bars, { name, url }];

  fs.writeFileSync(
    database,
    JSON.stringify({ bars, users: databaseJson.users })
  );
}

async function addBar(msgTxt) {
  //обработка сообщения для разработки
  if (msgTxt.match(/#место_dev/gi)) {
    const [tag, name, url, ...rest] = String(msgTxt).split(" ");
    addBarToDB(name, url);
    return { err: false, name, url };
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

  // if (name) {
  //   addBarToDB(name, urls[0]);
  // }

  return { err: false, name, url: urls[0] };
}

export { addBar };
