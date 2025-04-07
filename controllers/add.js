const puppeteer = require("puppeteer");

// получаем название бара из URL
async function getTitleByUrl(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 3000 });
  } catch (e) {}

  await page.content();

  const title = await page.evaluate(() =>
    document.title.replace(", Москва — Яндекс Карты", "")
  );

  await browser.close();
  return title || "не вышло";
}

module.exports.addBar = async (msgTxt) => {
  console.log(msgTxt);

  // сперва разбиваем на строчки
  // затем каждую строчку проверяем на наличие ссылки на гугл карты
  // затем эту строчку чистим от остального текста
  const url = msg.text
    .split("\n")
    .map((str) =>
      str.includes("https://")
        ? str.split(" ").find((el) => el.startsWith("https://"))
        : ""
    )
    .find((str) => str.startsWith("https://"));

  //TODO здесь вернуть сообщение в чат
  if (!url)
    return console.log(
      "в сообщении нет ссылки. либо добавьте ссылку либо добавьте место через dev",
      msg.text
    );

  const name = await getFileUrl(url);
  messages.push({ name, url });
  return console.log({ name, url });
};
