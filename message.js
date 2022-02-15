/*===========================================vk.com/c_o_d_e_r===============================================*/
const fs = require("fs");
const { VK, Keyboard } = require("vk-io");
const { HearManager } = require("@vk-io/hear");
const hearManager = new HearManager("<MessageContext>");

const vk = new VK({
  token: "",
  apiMode: "parallel",
  pollingGroupId: 111,
  uploadTimeout: 180e3,
});

const { updates } = vk;
const moment = require("moment"); // Красивое время!
/*----------------------------------------------------------------------------------------------------------*/
const stats = require("./base/stats.json");
const catalogBD = require("./base/catalog.json");

/*----------------------------------------------------------------------------------------------------------*/

let baseBuilder = Keyboard.builder();
let local_bd_users = {};

/*------------------------------------- Message handling----------------------------------------------------*/

vk.updates.on("message_new", async (message, next) => {
  message.user = message.senderId;
  if (message.user < 0) return;

  if (/\[club167936449\|(.*)\]/i.test(message.text))
    message.text = message.text.replace(/\[club167936449\|(.*)\]/gi, "").trim();

  let [info] = await vk.api.call("users.get", {
    fields: "sex",
    user_ids: message.user,
  });
  if (!local_bd_users[message.user]) {
    local_bd_users[message.user] = {
      category: false,
    };
  }

  if (message.messagePayload != undefined) {
    message.text = message.messagePayload.command;
  }

  if (message.text != null) {
    let word = stats.find((a) => a.name == message.text.toLowerCase());

    if (word) {
      word.all += 1;
      fs.writeFileSync("./base/stats.json", JSON.stringify(stats, null, "\t"));
    }
  }

  try {
    await next();
  } catch (err) {
    console.error(err);
  }
});

vk.updates.on("message_new", hearManager.middleware);

bot(/^(?:статистика)/i, async (message) => {
  let urlStats = await getStats();

  message.send(
    `📝 Статистика за все время по кнопкам:
  
	  ${stats
      .map((a) => {
        return `🔸 ${a.name} - ${a.all}`;
      })
      .toString()
      .replace(/,/g, "\n")}
	  `
  );

  return message.send(
    `📝 Статистика по переходам по ссылкам:
	  
	${urlStats
    .map((a) => {
      return `🔸 ${a.name}: ${a.views}`;
    })
    .toString()
    .replace(/,/g, "\n")}
  `,
    { keyboard: String(menu) }
  );
});

const getStats = async (obj) => {
  let object = [];

  catalog_link.map((link) => {
    link.urls.forEach(async (url) => {
      let data = await vk.api.call("utils.getLinkStats", {
        key: url.key,
        interval: "forever",
        source: "vk_cc",
      });
      if (url.key) {
        if (!data.stats.length) {
          object.push({
            views: 0,
            id: link.id,
            name: url.name,
          });
        } else {
          object.push({
            views: data.stats[0].views,
            id: link.id,
            name: url.name,
          });
        }
      }
    });
  });

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(object);
    }, 2000);
  });

  let result = await promise;
  return result;
};

/*----------------------------------------------------------------------------------------------------------*/

bot(/^(?:меню)/i, async (message) => {
  return message.send(`Меню`, { keyboard: String(menu) });
});

/*----------------------------------------------------------------------------------------------------------*/

bot(/^(?:каталог)/i, async (message) => {
  return message.send(`Выберите цифру на клавиатуре, чтобы открыть каталог: `, {
    attachment: "photo-30313045_457269534",
    keyboard: String(catalog),
  });
});

/*----------------------------------------------------------------------------------------------------------*/

bot(
  /^(?:как оплатить заказ|как оформить заказ|как оформить заказ онлайн)/i,
  async (message) => {
    return message.send(
      `Посмотрите короткое видео ниже 👇🏻.

      💵 Вносите предоплату за товар от 500 рублей:
      - оплата через ВКонтакте
      - на карту
      - перечислением на р/счет
      любой для Вас удобный формат.
      
      ❗Отправляем Вам заполненный договор на проверку и чек об оплате.
      
      💵 Привозим мебель заранее оговоренное с Вами время.
      Остаток оплачиваете дома любым удобным способом.
      📃 Передаем оригиналы договора и чеки об оплате
      
      🎁 Распаковываем каждую коробку перед Вами, показываем качество привезенной мебели. Вы спокойны и уверены, что мебель к Вам приехала в лучшем виде.
      
      После осмотра товара дома:
      📝 Подписываете акт-приема передачи.
      К Вам придет СМС уведомление, проверка качество нашей работы.
      
      Остались вопросы, пишите.
      Отвечаем очень быстро.
      `,
      { attachment: "video-30313045_456239139", keyboard: String(menu) }
    );
  }
);

/*----------------------------------------------------------------------------------------------------------*/

bot(/^(?:телефон)/i, async (message) => {
  return message.send(
    `☎ ТЕЛЕФОН для связи:

    г. Лениногорск
    ул. Энгельса 5а
    ул. Шашина 26
    
    Единый номер
    +7 (991) 222-0-777`,
    { keyboard: String(menu) }
  );
});

/*----------------------------------------------------------------------------------------------------------*/

bot(/^(?:график)/i, async (message) => {
  return message.send(
    `🗓 ГРАФИК РАБОТЫ:
    г. Лениногорск
    ул. Энгельса 5а
    ул. Шашина 26
    
    Пн-Пт с 08:00-17:00
    Суб 09:00-17:00
    Вос 09:00-17:00`,
    { keyboard: String(menu) }
  );
});

/*----------------------------------------------------------------------------------------------------------*/

bot(/^(?:наш адрес)/i, async (message) => {
  return message.send(
    `📍 НАШИ АДРЕСА:

    Магазин №1
    г.Лениногорск ул. Энгельса 5а
    
    Ссылка как к нам проехать https://vk.com/doremi.mebel?w=wall-30313045_36036
    
    Магазин №2
    г.Лениногорск ул. Шашина 26 (Военкомат)
    
    https://clck.ru/StdVG
    Как нас найти (2 -ой магазин)
	`,
    { keyboard: String(menu) }
  );
});

/*----------------------------------------------------------------------------------------------------------*/

bot(/^(?:доставка)/i, async (message) => {
  return message.send(
    `ДОСТАВКА 🚚 ДОСТАВКА🚚 ДОСТАВКА🚚

    ◆ ЛЕНИНОГОРСК
    Доставка ПЛАТНО 400 руб. по городу
    Подъем ПЛАТНО 200 р. за этаж
    Сборка БЕСПЛАТНО* только диваны.
    
    * Сборка корпусной мебели от 10% первоначальной стоимости
    
    ◆ БУГУЛЬМА
    Доставка БЕСПЛАТНО от 80 тысяч
    Доставка 1000₽ при покупке от 50 тысяч.
    До 50 тысяч, Доставка 1500₽
    Подъем 200₽ этаж.
    
    
    ◆ АЛЬМЕТЬЕВСК, АЗНАКАЕВО, АКТЮБА
    Доставка БЕСПЛАТНО от 100 тысяч
    Доставка 1500₽ от 60 тысяч
    До 60 тысяч Доставка 2 500₽
    Подъем 200₽ этаж.`,
    { keyboard: String(menu) }
  );
});

/*----------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------*/

const catalog = baseBuilder.clone();
const menu = baseBuilder.clone();

/*----------------------------------------------------------------------------------------------------------*/

menu
  .textButton({
    label: `📕 Каталог`,
    payload: { command: `каталог` },
    color: Keyboard.POSITIVE_COLOR,
  })
  .row()
  .textButton({
    label: `✍ Как оформить заказ онлайн?`,
    payload: { command: `Как оформить заказ` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .row()
  .textButton({
    label: `☎ Телефон`,
    payload: { command: `Телефон` },
    color: Keyboard.POSITIVE_COLOR,
  })
  .textButton({
    label: `🗓 График`,
    payload: { command: `График` },
    color: Keyboard.POSITIVE_COLOR,
  })
  .row()
  .textButton({
    label: `📍 Наш адрес`,
    payload: { command: `Наш адрес` },
    color: Keyboard.POSITIVE_COLOR,
  })
  .textButton({
    label: `🚚 Доставка`,
    payload: { command: `Доставка` },
    color: Keyboard.POSITIVE_COLOR,
  })
  .row();

/*----------------------------------------------------------------------------------------------------------*/

var catalog_link = catalogBD;

catalog
  .textButton({
    label: `🔹 1`,
    payload: { command: `акции` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔹 2`,
    payload: { command: `диваны` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔹 3`,
    payload: { command: `матрасы и чехлы` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔹 4`,
    payload: { command: `шкафы-купе` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .row()
  .textButton({
    label: `🔸 5`,
    payload: { command: `шкафы распашные` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔸 6`,
    payload: { command: `гостиные` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔸 7`,
    payload: { command: `кровати` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔸 8`,
    payload: { command: `спальные гарнитуры` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .row()
  .textButton({
    label: `🔹 9`,
    payload: { command: `компьютерные столы` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔹 10`,
    payload: { command: `всё для детей` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔹 11`,
    payload: { command: `детские матрасы` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔹 12`,
    payload: { command: `комоды` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .row()
  .textButton({
    label: `🔸 13`,
    payload: { command: `тв тумбы` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔸 14`,
    payload: { command: `прихожие` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔸 15`,
    payload: { command: `кресла` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .textButton({
    label: `🔸 16`,
    payload: { command: `малые формы` },
    color: Keyboard.PRIMARY_COLOR,
  })
  .row()
  .textButton({
    label: `📕 Каталог`,
    payload: { command: `каталог` },
    color: Keyboard.POSITIVE_COLOR,
  })
  .textButton({
    label: `📕 В наличии`,
    payload: { command: `В наличии` },
    color: Keyboard.POSITIVE_COLOR,
  })
  .row()
  .textButton({
    label: `❌ Меню`,
    payload: { command: `меню` },
    color: Keyboard.NEGATIVE_COLOR,
  });

/*----------------------------------------------------------------------------------------------------------*/

function date() {
  return `[${moment(Date.now()).format("DD.MM.YYYY | HH:mm:ss")}]`.red;
}

/*----------------------------------------------------------------------------------------------------------*/

async function bot(hearConditions, handler) {
  hearManager.hear(hearConditions, handler);
}

/*----------------------------------------------------------------------------------------------------------*/

function rand(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

/*----------------------------------------------------------------------------------------------------------*/
async function run() {
  await vk.updates.startPolling();
}
run()
  .then(() => {
    console.log("[START] --> ");
  })
  .catch((error) => {
    console.error("[ERROR] | " + error);
  });

/*----------------------------------------------------------------------------------------------------------*/
/*========================================DEVELOPER VLAD KUCHER=============================================*/
/*===========================================vk.com/c_o_d_e_r===============================================*/
/*----------------------------------------------------------------------------------------------------------*/
