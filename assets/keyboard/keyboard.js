module.exports = {
    userStartKeyboard: {
      reply_markup: {
        keyboard: [
          [{ text: "👤 Личный Профиль" }],
          [{ text: "⚔️ Арены" }],
          [{ text: "🛒 Магазин паков" }],
          [{ text: "🀄️ Добвыить карту в инвентарь матчей" }][
            { text: "🀄️ Получить карточку" }
          ],
        ],
        resize_keyboard: true,
      },
    },
    adminStartKeyboard: {
      reply_markup: {
        keyboard: [
          [{ text: "👤 Личный Профиль" }],
          [{ text: "⚔️ Арены" }],
          [{ text: "🛒 Магазин паков" }],
          [{ text: "🀄️ Получить карточку" }],
          [{ text: "⚙️ Админ Панель" }],
        ],
        resize_keyboard: true,
      },
    },
    profileKeyboard: {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "💮 Мои карточки", callback_data: "" }],
          [{ text: "⚔️ Моя команда", callback_data: "" }],
          [{ text: "🎁 Ввести прокод", callback_data: "" }],
          [{ text: "✏️ Изменить имя", callback_data: "" }],
          [{ text: "💮 Мои карточки", callback_data: "mycards" }],
          [{ text: "⚔️ Моя команда", callback_data: "myteam" }],
          [{ text: "🎁 Ввести прокод", callback_data: "checkpromo" }],
          [{ text: "✏️ Изменить имя", callback_data: "changename" }],
          [{ text: "⭕️ Закрыть окно ⭕️", callback_data: "closewindow" }],
        ],
        resize_keyboard: true,
      }),
    },
    arenaKeyboard: {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "Обычная", callback_data: "usualmatch" }],
          [{ text: "Рейтинговая", callback_data: "ratingmatch" }],
        ],
        resize_keyboard: true,
      }),
    },
    shopKeyboard: {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "💰 Купить 1 пак", callback_data: "getonepack" }],
          [{ text: "💰 Купить 5 паков", callback_data: "getfivepacks" }],
          [{ text: "💰 Купить 10 паков", callback_data: "gettenpacks" }],
          [{ text: "💰 Купить 1 пак", callback_data: "getonepack" }],
          [{ text: "💰 Купить 5 паков", callback_data: "getfivepacks" }],
          [{ text: "💰 Купить 10 паков", callback_data: "gettenpacks" }],[
            { text: "⏮", callback_data: "back_first" },
            { text: "⏪", callback_data: "back_prev" },
            { text: "◀️", callback_data: "back_left" },
            { text: "1/1", callback_data: "back_current" },
            { text: "▶️", callback_data: "back_right" },
            { text: "⏩", callback_data: "back_next" },
            { text: "⏭", callback_data: "back_last" },
          ],
          [{ text: "⭕️ Закрыть окно ⭕️", callback_data: "closewindow" }],[
            { text: "⏭", callback_data: "back_last" }
          ],
          [{ text: "⭕️ Закрыть окно ⭕️", callback_data: "closewindow" }],
        ],
        resize_keyboard: true,
      }),
    },
    adminOptionsKeyboard: {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "создать раздел", callback_data: "createChapter" }],
          [
            {
              text: "описать карты в разделе",
              callback_data: "describeCardInChapter",
            },
          ],
          [{ text: "назначить стоймость карты", callback_data: "cardAmount" }],
          [{ text: "создать прокомокд", callback_data: "createPromo" }],
          [{ text: "вывести всех пользователей", callback_data: "showAllUsers" }],
          [{ text: "найти конкретного пользователя", callback_data: "findUser" }],
          [
            {
              text: "добавить карту пользователю",
              callback_data: "addCardToUser",
            },
          ],
          [{ text: "Добавить админа", callback_data: "setAdmin" }],
        ],
      }),
    },
  };
  