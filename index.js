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
  console.log(message);
});

bot.on("polling_error", (msg) => console.log(msg));

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
  const title = await page.evaluate(() => document.title);

  if (title) {
    console.log(title);
  } else {
    throw Error("Unable to take screenshot");
  }

  await page.close();
  await browser.close();
}
