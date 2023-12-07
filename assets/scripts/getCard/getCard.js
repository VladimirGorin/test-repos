const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../db/db.json");
const db = require(dbPath);

const imagesPath = path.join(__dirname, "../../db/images/images.json");
const imagesData = require(imagesPath);

function giveRandomCardToUser(bot, msg) {
  try {

    if (!Array.isArray(imagesData)) {
      console.error("Ошибка: imagesData не является массивом.");
      return bot.sendMessage(msg.chat.id, "Произошла ошибка при выдаче карты. Попробуйте еще раз.");
    }

    const userIndex = db.findIndex((user) => user.username === msg.from.username);

    if (userIndex === -1) {
      console.error("Ошибка: Пользователь не найден.");
      return bot.sendMessage(msg.chat.id, "Произошла ошибка при выдаче карты. Попробуйте еще раз.");
    }

    if (!db[userIndex].hasOwnProperty('inventory')) {
      db[userIndex].inventory = [];
    }

    const randomIndex = Math.floor(Math.random() * imagesData.length);

    const randomCard = imagesData[randomIndex];

    db[userIndex].inventory.push(randomCard);

    fs.writeFileSync(dbPath, JSON.stringify(db, null, "\t"));

    return bot.sendMessage(
      msg.chat.id,
      `Пользователю ${msg.from.username} добавлена карта: ${randomCard.name} (Редкость: ${randomCard.rarity})`
    );
  } catch (error) {
    console.error("Произошла ошибка при чтении файла карт:", error.message);
    return bot.sendMessage(
      msg.chat.id,
      "Произошла ошибка при выдаче карты. Попробуйте еще раз."
    );
  }
}

module.exports = {
  giveRandomCardToUser: giveRandomCardToUser,
};
