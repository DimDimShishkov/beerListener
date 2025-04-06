const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const http = require("http");

const puppeteer = require("puppeteer");

// Создаем бота
const bot = new TelegramBot(process.env.TOKEN, {polling: true});

// Создаем сервер с Express
const app = express();
const server = http.createServer(app);

// Статическая папка для работы с файлами (например, CSS, изображения)
app.use(express.static("public"));

// Массив для хранения баров
let messages = [];

// получаем название бара из URL
async function getFileUrl(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, {waitUntil: "networkidle0", timeout: 3000});
  } catch (e) {}

  await page.content();

  const title = await page.evaluate(() =>
    document.title.replace(", Москва — Яндекс Карты", ""),
  );

  await browser.close();
  return title || "не вышло";
}

// Обработчик получения сообщений из Telegram
bot.on("message", async (msg) => {
  // если со стикером, картинкой итд
  if (!msg.text) return;

  // если в сообщении нет тега #место
  if (!msg.text.match(/#место/gi)) return;

  // сперва разбиваем на строчки
  // затем каждую строчку проверяем на наличие ссылки на гугл карты
  // затем эту строчку чистим от остального текста
  const url = msg.text
    .split("\n")
    .map((str) =>
      str.includes("https://")
        ? str.split(" ").find((el) => el.startsWith("https://"))
        : "",
    )
    .find((str) => str.startsWith("https://"));
  if (url) {
    const name = await getFileUrl(url);
    messages.push({name, url});
    return console.log({name, url});
  }
  messages.push({name: "место не распознано", url: msg.text});
  // вернуть в чат сообщение "место не распознано"
  return console.log("место не распознано", msg.text);
});

// Запуск сервера на порту 3000
server.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});

