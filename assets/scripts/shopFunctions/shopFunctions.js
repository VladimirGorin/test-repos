const fs = require("fs");
const path = require("path");

const cardsPath = path.join(__dirname, "../../db/images/images.json");
const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));

const dbFilePath = path.join(__dirname, "../../db/db.json");
const users = require(dbFilePath) || [];

function getPack(bot, msg, packCount) {
  try {
    const userId = msg.from.id;
    const username = msg.from.username;

    const userIndex = users.findIndex(
      (x) => x.username.toLowerCase() === username.toLowerCase()
    );

    if (userIndex === -1) {
      console.error("Пользователь не найден.");
      return bot.sendMessage(userId, "Пользователь не найден.");
    }

    const user = users[userIndex];

    const totalCost = cards.reduce((acc, card) => acc + card.power, 0) * packCount;

    if (user.balance == null || isNaN(user.balance)) {
      user.balance = 0; 
    }

    if (user.balance < totalCost) {
      console.error("У вас недостаточно баланса для открытия паков.");
      return bot.sendMessage(
        userId,
        `У вас недостаточно баланса для открытия ${packCount} паков.`
      );
    }

    const openedCards = [];
    let updatedBalance = user.balance; // Use a temporary variable

    for (let i = 0; i < packCount; i++) {
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      const existingCard = user.inventory.find((card) => card.name === randomCard.name);

      console.log('Random Card:', randomCard);
      console.log('Existing Card:', existingCard);

      if (existingCard && typeof existingCard.power === 'number') {
        updatedBalance += 0.5 * existingCard.power;
      } else if (typeof randomCard.power === 'number') {
        user.inventory.push(randomCard);
        openedCards.push(randomCard);
        updatedBalance += 0.5 * randomCard.power;
      } else {
        console.error('Invalid card power:', randomCard.power);
      }
    }

    if (isNaN(updatedBalance) || updatedBalance < 0) {
        console.error("Invalid updated balance. Updated Balance:", updatedBalance);
        throw new Error("Invalid updated balance");
    }

    users[userIndex].balance = updatedBalance;

    fs.writeFileSync(dbFilePath, JSON.stringify(users, null, "\t"));

    bot.sendMessage(
      userId,
      `Вы открыли ${packCount} паков и получили карты: ${openedCards
        .map((card) => card.name)
        .join(", ")}. Новый баланс: ${users[userIndex].balance}.`
    );
  } catch (error) {
    bot.sendMessage(msg.message.from.id, "Произошла ошибка при обработке вашего запроса.");
    console.error("Произошла ошибка:", error);
    throw error;
  }
}

module.exports = {
  getPack: getPack,
};
