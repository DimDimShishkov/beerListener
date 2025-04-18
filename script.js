// const TelegramBot = require("node-telegram-bot-api");
// const express = require("express");
// const http = require("http");
// const {addBar} = require("./controllers/add");
// const {generatePoll} = require("./controllers/pool");
// const dotenv = require("dotenv");

// dotenv.config();

// // Создаем бота
// const bot = new TelegramBot(process.env.TOKEN, {polling: true});

// // Создаем сервер с Express
// const app = express();
// const server = http.createServer(app);

// // Статическая папка для работы с файлами (например, CSS, изображения)
// app.use(express.static("public"));

// // Обработчик получения сообщений из Telegram
// bot.on("message", async (msg) => {
//   // если со стикером, картинкой итд
//   if (!msg.text) return;
//   const chatId = msg.chat.id;

//   // если в сообщении есть теги #место и #место_dev
//   if (msg.text.match(/#место/gi)) {
//     const {err, name, url} = await addBar(msg.text);
//     if (err) return bot.sendMessage(chatId, name);
//     return bot.sendMessage(chatId, `место добавлено!\nназвание: ${name}\nссылка: ${url}`);
//   } else if (msg.text.match(/#опрос/gi)) {
//     const bars = await generatePoll(msg.text);
//     return bot.sendPoll(chatId, "куда пойдём?", bars, {
//       allows_multiple_answers: true,
//       is_anonymous: false,
//     });
//   }
// });

// bot.on("polling_error", (msg) => console.log(msg));

// // Запуск сервера на порту 3000
// server.listen(3001, () => {
//   console.log("Server started on http://localhost:3001");
// });

const puppeteer = require("puppeteer-core");
const fs = require("fs");

screenshot("https://example.com").then(() => console.log("screenshot saved"));

async function screenshot(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, {
    timeout: 0,
    waitUntil: "networkidle0",
  });
  const screenData = await page.screenshot({
    encoding: "binary",
    type: "jpeg",
    quality: 100,
  });
  if (!!screenData) {
    fs.writeFileSync("screenshots/screenshot.jpg", screenData);
  } else {
    throw Error("Unable to take screenshot");
  }

  await page.close();
  await browser.close();
}
