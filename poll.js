//TODO заменить на обращение к БД
const fs = require("fs");
const path = require("path");

//TODO заменить на обращение к БД
async function generatePoll() {
  const database = path.resolve(__dirname, "./database.json");
  const databaseJson = JSON.parse(fs.readFileSync(database, "utf8"));
  return (databaseJson.bars || [])?.splice(-10)?.map(({ name }) => name);
}

module.exports = generatePoll;
