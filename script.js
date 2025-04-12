const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const http = require("http");
const {addBar} = require("./controllers/add");
const {generatePoll} = require("./controllers/pool");
import dotenv from "dotenv";

dotenv.config();

// Создаем бота
const bot = new TelegramBot(process.env.TOKEN, {polling: true});

// Создаем сервер с Express
const app = express();
const server = http.createServer(app);

// Статическая папка для работы с файлами (например, CSS, изображения)
app.use(express.static("public"));

// Обработчик получения сообщений из Telegram
bot.on("message", async (msg) => {
  // если со стикером, картинкой итд
  if (!msg.text) return;
  const chatId = msg.chat.id;

  // если в сообщении есть теги #место и #место_dev
  if (msg.text.match(/#место/gi)) {
    const {err, name, url} = await addBar(msg.text);
    if (err) return bot.sendMessage(chatId, name);
    return bot.sendMessage(chatId, `место добавлено!\nназвание: ${name}\nссылка: ${url}`);
  } else if (msg.text.match(/#опрос/gi)) {
    const bars = await generatePoll(msg.text);
    return bot.sendPoll(chatId, "куда пойдём?", bars, {
      allows_multiple_answers: true,
      is_anonymous: false,
    });
  }
});

bot.on("polling_error", (msg) => console.log(msg));

// Запуск сервера на порту 3000
server.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});

