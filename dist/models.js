const Sequelize = require("sequelize");

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const Comm = db.define("comm", {
  body: { type: Sequelize.TEXT },
  authorId: { type: Sequelize.STRING },
  date: { type: Sequelize.DATE }
});

db.sync();

module.exports = { Comm };