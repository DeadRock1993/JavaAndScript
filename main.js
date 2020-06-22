//В дальнейшем при появлении новых видов пьес (жанров),
// можно лишь добавить условия - в эти две функции:
// priceForTypeOfPlay и checkAmountOfAudience,
// а не менять всю логику
// так же с countBonus посчетом бонусов
const priceForTypeOfPlay = (typeOfPlay) => {
  if (typeOfPlay === "tragedy") return 40000;
  else if (typeOfPlay === "comedy") return 30000;
  else throw new Error("Неизвестный тип пьесы.");
}; //проверяет тип пьесы и сумму за этот тип возвр

const checkAmountOfAudience = (typeOfPlay, people) => {
  if (typeOfPlay === "tragedy" && people > 30) return 1000 * (people - 30);
  else if (typeOfPlay === "comedy") {
    let amount = 300 * people;
    if (people > 20) {
      amount += 10000 + 500 * (people - 20);
    }
    return amount;
  } else return 0;
}; //подсчет суммы оплаты по количеству людей

const countBonus = (typeOfPlay, people) => {
  let bonus = Math.max(people - 30, 0);
  if (typeOfPlay === "comedy") bonus += Math.floor(people / 10);
  return bonus;
}; //подсчет бонуса

const getData = async () => {
  const response = await fetch("./invoices.json");
  const json = await response.json();
  const data = json[0]; //данные/объект который получили из json файл

  function statement(invoice) {
    const { customer, performance } = invoice;
    let totalAmount = 0; //конечная ценна услуг
    let volumeCredits = 0; //бонусы клиента
    let result = `Счет для ${customer}\n`; //текст/инфо

    const format = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
    }).format; // формат валюты

    for (let play of performance) {
      const { playId, audience, type } = play;
      let thisAmount = priceForTypeOfPlay(type);
      thisAmount += checkAmountOfAudience(type, audience);
      totalAmount += thisAmount;
      volumeCredits += countBonus(type, audience);
      // Вывод строки счета
      result += `${playId}: ${format(thisAmount)}`;
      result += ` (${audience} мест)\n`;
    }
    result += `Итого с вас ${format(totalAmount)}\n`;
    result += `Вы заработали ${volumeCredits} бонусов\n`;
    return result;
  }
  let res = statement(data);
  console.log(res);
};
getData();
