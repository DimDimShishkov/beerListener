const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const addBar = require("./add");
const generatePoll = require("./poll");
dotenv.config();

// Создаем бота
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.on("message", async (msg) => {
  // если со стикером, картинкой итд
  if (!msg.text) return;
  const chatId = msg.chat.id;

  // если в сообщении есть теги #место и #место_dev
  if (msg.text.match(/#место/gi)) {
    const { err, name, url } = await addBar(msg.text);
    if (err) return bot.sendMessage(chatId, name);
    return bot.sendMessage(
      chatId,
      `место добавлено!\nназвание: ${name}\nссылка: ${url}`
    );
  } else if (msg.text.match(/#опрос/gi)) {
    const bars = await generatePoll(msg.text);
    return bot.sendPoll(chatId, "куда пойдём?", bars, {
      allows_multiple_answers: true,
      is_anonymous: false,
    });
  }
});

bot.on("polling_error", (msg) => console.log(msg));
