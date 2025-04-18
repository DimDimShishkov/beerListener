const {Builder} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

//TODO заменить на обращение к БД
const fs = require("fs");
const path = require("path");

// получаем название бара из URL
async function getTitleByUrl(url) {
  // set the browser options
  const options = new chrome.Options().addArguments("--headless");

  // initialize the webdriver
  const driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    // navigate to the target webpage
    await driver.get(url);

    // extract HTML of the target webpage
    const title = await driver.getTitle();
    console.log(title);
  } catch (error) {
    // handle error
    console.error("An error occurred:", error);
  } finally {
    // quit browser session
    await driver.quit();
  }
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

  // if (name) {
  //   addBarToDB(name, urls[0]);
  // }

  return {err: false, name, url: urls[0]};
};

