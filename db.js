//TODO заменить на обращение к БД
const fs = require("fs");
const path = require("path");

//TODO заменить на обращение к БД
function editBarDB(name, url, add) {
  const database = path.resolve(__dirname, "./database.json");
  const databaseJson = JSON.parse(fs.readFileSync(database, "utf8"));
  let bars;
  if (add) {
    bars = [...databaseJson.bars, { name, url }];
  } else {
    bars = databaseJson.bars.filter((bar) => bar.name !== name);
  }

  fs.writeFileSync(
    database,
    JSON.stringify({ bars, users: databaseJson.users })
  );
}

module.exports = editBarDB;
