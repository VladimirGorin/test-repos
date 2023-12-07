const fs = require("fs");
const shopTextPath = "../../db/shop/shopText.json";
const users = require("../../db/db.json");
const path = require('path');

const promosPath = path.resolve(__dirname, '../../db/promos/promos.json');

async function createPromo(bot, msg) {
  try {
    console.log("Сообщение от пользователя:", msg);

    await bot.sendMessage(msg.message.chat.id, "Пришлите мне промокод");

    const userResponse = await bot.onText(/(.+)/, async (responseMsg, match) => {
      const promoText = match[1].trim();

      console.log("Текст сообщения:", promoText);

      console.log("Путь к файлу:", promosPath);

      console.log("Чтение файла...");
      let promos = JSON.parse(fs.readFileSync(promosPath, "utf-8"));

      console.log("Содержимое файла promos.json перед обновлением:", promos);

      console.log("Ищем промокод с именем:", promoText);

      const promo = promos.find((promo) => promo.name === promoText);

      if (!promo) {
        console.log("Промокод не найден. Добавляем новый промокод.");

        promos.push({ name: promoText });

        console.log("Запись файла...");

        fs.writeFileSync(promosPath, JSON.stringify(promos, null, 2), "utf-8");

        await bot.sendMessage(responseMsg.chat.id, "Промокод был добавлен в базу данных");
      } else {
        console.log("Промокод с таким именем уже существует.");

        await bot.sendMessage(
          responseMsg.chat.id,
          "Промокод с таким именем уже существует"
        );
      }

      console.log("Содержимое файла promos.json после обновления:", promos);
    });
  } catch (error) {
    console.error("Произошла ошибка:", error.message);

    await bot.sendMessage(
      msg.message.chat.id,
      "Произошла ошибка при обработке промокода"
    );
  }
}




async function updateShopText(bot, msg) {
  try {
    const shopData = JSON.parse(fs.readFileSync(shopTextPath));

    if (shopData.length > 0) {
      shopData[0].text = msg.text;
      await bot.sendMessage(msg.chat.id, "текст для шопа был успешно добавлен");
      await bot.sendMessage(msg.message.chat.id, "текст для шопа был успешно добавлен");
    } else {
      console.error("JSON-файл не содержит ожидаемую структуру");
      return;
    }

    fs.writeFileSync(shopTextPath, JSON.stringify(shopData, null, 2));
  } catch (error) {
    console.error("Ошибка при обновлении данных в JSON-файле:", error);
  }
}

async function setAdmin(bot, msg) {
  const isCommand = msg.text.startsWith('/');

  if (isCommand) {
    console.log('Received a command:', msg.text);
  const isCommand = msg.text.startsWith("/");

  if (isCommand) {
    console.log("Received a command:", msg.text);
    return;
  }
  const user = users.find((user) => user.username === msg.text);

  if (!user) {
    await bot.sendMessage(
      msg.chat.id,
      `Пользователя с именем ${msg.text} не существует.`
    );
    return;
  }

  user.isAdmin = true;

  fs.writeFileSync("./assets/db/db.json", JSON.stringify(users, null, "\t"));

  await bot.sendMessage(
    msg.chat.id,
    `Пользователь @${msg.text} теперь админ.`
  );
}

  await bot.sendMessage(msg.chat.id, `Пользователь @${msg.text} теперь админ.`);
}

async function askCardDetails(bot, msg) {
  try {
    await bot.sendMessage(msg.message.chat.id, "Введите название карты:");
    const cardNameMessage = await waitForText(bot, msg.message.chat.id);

    await bot.sendMessage(msg.message.chat.id, "Прикрепите фото карты:");
    const cardPhotoMessage = await waitForPhoto(bot, msg.message.chat.id);

    await bot.sendMessage(msg.message.chat.id, "Введите силу карты:");
    const cardPowerMessage = await waitForText(bot, msg.message.chat.id);

    return {
      cardName: cardNameMessage.text,
      cardPhoto: cardPhotoMessage.photo[0].file_id,
      cardPower: parseInt(cardPowerMessage.text),
    };
  } catch (error) {
    console.error("Ошибка при запросе данных от админа:", error);
  }
}

async function waitForText(bot, chatId) {
  return new Promise((resolve) => {
    bot.on("message", (msg) => {
      if (msg.chat.id === chatId) {
        resolve(msg);
      }
    });
  });
}

async function waitForPhoto(bot, chatId) {
  return new Promise((resolve) => {
    bot.on("photo", (msg) => {
      if (msg.chat.id === chatId) {
        resolve(msg);
      }
    });
  });
}

async function giveCardToUser(bot, msg) {
  const cardDetails = await askCardDetails(bot, msg.chat.id);

  const targetUser = users.find((user) => user.username === msg.text);

  if (!targetUser) {
    await bot.sendMessage(msg.chat.id, "Пользователь не найден.");
    return;
  }

  targetUser.inventory.push({
    cardName: cardDetails.cardName,
    cardPhoto: cardDetails.cardPhoto,
    cardPower: cardDetails.cardPower,
  });

  await bot.sendMessage(
    msg.chat.id,
    `Карта успешно присвоена пользователю ${msg.text}.`
  );
}

async function findUser(bot, msg) {
  if (msg.chat && msg.chat.id) {
    const username = msg.text.replace(/[^a-zA-Z0-9_]/g, '');//регулярное выражение чтобы фильтровать текст который приходит

    let user = users.find((user) => user.username === username);
    if (!user) {
      await bot.sendMessage(msg.chat.id, "Такого пользователя не существует");
    } else {
      await bot.sendMessage(
        msg.chat.id,
        `id: ${user.id}\nusername: ${user.username}\nfirst_name: ${user.first_name}\nlast_name: ${user.last_name}\nbalance: ${user.balance}\nrating: ${user.rating}\n${user.inventory}\nadmin: ${user.isAdmin}`
      );
    }
  } else {
    console.error('Invalid message structure:', msg);
  }
}

async function showAllUsers(bot, msg) {
  for (const user of users) {
    await bot.sendMessage(
      msg.message.chat.id,
      `Имя пользователя: ${user.username}\nИмя: ${user.first_name}\nФамилия: ${
        user.last_name
      }\nID: ${user.id}\nБаланс: ${user.balance}\nРейтинг: ${
        user.rating === null ? "N/A" : user.rating
      }\nАдминистратор: ${user.isAdmin}\nПодходит: ${user.isMatch}\nОжидает: ${
        user.isWaiting
      }\n---------------------`
    );
  }
}
async function describeCardInChapter(bot, msg) {

}


module.exports = {
  askCardDetails: askCardDetails,
  updateShopText: updateShopText,
  setAdmin: setAdmin,
  giveCardToUser: giveCardToUser,
  findUser: findUser,
  createPromo: createPromo,
  showAllUsers: showAllUsers,
};

