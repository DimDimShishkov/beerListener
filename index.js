const puppeteer = require("puppeteer-core");
// const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
dotenv.config();

// Создаем бота
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.on("message", async (msg) => {
  // если со стикером, картинкой итд
  if (!msg.text) return;
  const chatId = msg.chat.id;

  // если в сообщении есть теги #место и #место_dev
  if (msg.text.match(/#место/gi)) {
    const { err, name, url } = await screenshot(msg.text);
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

// screenshot("https://example.com").then(() => console.log("screenshot saved"));

async function screenshot(msgTxt) {
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

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(urls[0], {
    timeout: 0,
    waitUntil: "networkidle0",
  });
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
