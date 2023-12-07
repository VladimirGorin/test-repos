const fs = require("fs");
const users = require( "../../db/db.json")
const shopTextDb = require("../../db/shop/shop.json");
const { profileKeyboard, shopKeyboard } = require("../../keyboard/keyboard");
const promos = require('../../db/promos/promos.json')

async function sendProfileData(bot, msg) {
  let user = users.filter((user) => user.username === msg.from.username);
  for (const userData of user) {
    await bot.sendMessage(msg.chat.id, `Имя пользователя: ${userData.username}\nID: ${userData.id}\nИмя: ${userData.first_name}\nФамилия: ${userData.last_name}\nБаланс: ${userData.balance}\nРейтинг: ${userData.rating}\nИнвентарь: ${userData.inventory}\n`, { reply_markup: JSON.stringify(profileKeyboard) });
  }
}

async function myCards(bot, msg){
  const user = users.find(user => user.username === msg.data.from.username)
  for (let card in user){
    console.log(card)
    await bot.sendMessage(msg.message.chat.id, card)
  }
}

async function checkPromo(bot, msg){
  let promo = promos.find(promo => promo.name === msg.text)
  if (!promo){
    await bot.sendMessage(msg.message.chat.id, "такого промокода не существует")
  }else {
    await bot.sendMessage(msg.message.chat.id, "поздравляю вы ввели промокод успешно")
    promo.name = {}
    fs.writeFileSync("../../db/promos/promos.json", JSON.stringify(promo.text,  null, '\t'))
  }
}

async function changeName(bot, msg){
  let name = users.find(user => user.username === msg.data.from.username)
  if (!name){
    await bot.sendMessage(msg.message.chat.id, "вас нету в базе данных")
  }else{
    await bot.sendMessage(msg.message.chat.id, "напишите имя на которое хотите изменить ваш username")
    name.username = msg.text
    fs.writeFileSync("../../db/db.json", JSON.stringify(name.username, null,  '\t'))
  }
}

module.exports = {
  sendProfileData: sendProfileData,
  changeName: changeName,
  myCards: myCards,
  checkPromo: checkPromo
};
