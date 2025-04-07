const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const http = require("http");
const { addBar } = require("./controllers/add");

// Создаем бота
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Создаем сервер с Express
const app = express();
const server = http.createServer(app);

// Статическая папка для работы с файлами (например, CSS, изображения)
app.use(express.static("public"));

// Массив для хранения баров
let messages = [];

// Обработчик получения сообщений из Telegram
bot.on("message", async (msg) => {
  // если со стикером, картинкой итд
  if (!msg.text) return;

  // если в сообщении нет тега #место
  if (!msg.text.match(/#место/gi)) return;

  const name = await addBar(msg.text);
  messages.push({ name, url });
  return console.log({ name, url });
});

// Запуск сервера на порту 3000
server.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});
