
// sorted as in Tinkoff MCC codes *.pdf
enum TinkoffCategory {
  FLIGHTS =               "Авиабилеты",
  CAR_SERVICES =          "Автоуслуги",
  PHARMACY =              "Аптеки",
  CAR_RENT =              "Аренда авто",
  HOUSE_RENOVATION =      "Дом, ремонт",
  TRAIN_TICKETS =         "Ж/д билеты",
  ANIMALS =               "Животные",
  ART =                   "Искусство",
  CINEMA =                "Кино",
  BEAUTY =                "Красота",
  MEDICAL_SERVICES =      "Медицинские услуги",
  MUSIC =                 "Музыка",
  CASH =                  "Наличные",
  NCO =                   "НКО",
  EDUCATION =             "Образование",
  CLOTHES_SHOES =         "Одежда, обувь",
  HOTELS =                "Отели",
  BUDGET_PAYMENTS =       "Платежи в бюджет",
  ENTERTAINMENT =         "Развлечения",
  MISCELLANEOUS_GOODS =   "Разные товары",
  RESTAURANTS =           "Рестораны",
  COMMUNICATION_TELECOM = "Связь, телеком",
  SERVICE =               "Сервис-услуги",
  SPORT =                 "Спорттовары",
  SOUVENIRS =             "Сувениры",
  SUPERMARKETS =          "Супермаркеты",
  FUEL =                  "Топливо",
  TRANSPORT =             "Транспорт",
  TRAVEL_AGENCIES =       "Турагентства",
  FAST_FOOD =             "Фастфуд",
  FINANCIAL_SERVICES =    "Финансовые услуги",
  PHOTO_VIDEO =           "Фото/Видео",
  FLOWERS =               "Цветы",
  PRIVATE_SERVICES =      "Частные услуги",
  DUTY_FREE =             "Duty Free",

  // categories missing in Tinkoff pdf
  MOBILE_IB =             "Мобильные/иб",  
  INTERNET_VOIP_IB =      "Интернет, voip/иб",
  OTHER =                 "Другое", // NB: NOT shown within MCC codes table, but might be shown in data (e.g. Tinkoff cashback, Youtube subscription)
  OTHER_OPERATIONS =      "ДРУГИЕ ОПЕРАЦИИ", // NB: NOT shown within MCC codes table, but might be shown in data (e.g. Youtube subscription)
  OTHER_SERVICES_IB =     "Прочие услуги/иб", // NB: NOT shown within MCC codes table, but might be shown in data (e.g. Tinkoff Pro subscription)
  UNKNOWN =               "Unknown", // a mock for an unknown mcc code if any
}

enum MyExpenseCategory {
  BUDGET_PAYMENTS =                    "Платежи в бюджет",
  CAFE =                               "Еда вне дома",
  CASH =                               "Наличные",
  CHARITY =                            "Благотворительность",
  CLOTHES =                            "Одежда",
  COMMISSION =                         "Комиссии",
  CRYPTOCURRENCY =                     "Криптовалюта",
  EDUCATION =                          "Образование",
  ENTERTAINMENT =                      "Развлечения",
  FOOD =                               "Продукты",
  FOOD_ORDERING =                      "Еда на дом",
  GOODS =                              "Подарки",
  HOUSE =                              "Дом",
  MEDICINE =                           "Медицина",
  MINING =                             "Майнинг",
  MISCELLANEOUS_GOODS =                "Разные товары",
  MUSIC =                              "Музыка",
  OTHER =                              "Другое",
  PRESENTS =                           "Подарки",
  REGULAR_HOUSE_COMMUNICATNION_BILLS = "ЖКУ/Интернет/Мобильный",
  SPORT =                              "Спорт",
  SUBSCRIPTIONS =                      "Подписки",
  TRANSFERS =                          "Переводы",
  TRANSPORT =                          "Транспорт",
  TRAVEL =                             "Путешествия",
}

enum MyIncomeCategory {
  ALM =                              "ALM",
  PTI =                              "ФТИ",
  DEPOSIT_SAVINGS_ACCOUNT_INTEREST = "Вклады/НС",
  CASHBACK =                         "Кэшбэк",
  STOCK_EXCHANGE =                   "Биржа",
  CRYPTOCURRENCY =                   "Криптовалюта",
  OTHER =                            "Другое"
}

/**
 * Sorted by enum element values (e.g. alphabetically in russian)
 */
const MY_EXPENSE_CATEGORIES_LIST = [
  MyExpenseCategory.BUDGET_PAYMENTS,
  MyExpenseCategory.CAFE,
  MyExpenseCategory.CASH,
  MyExpenseCategory.CHARITY,
  MyExpenseCategory.CLOTHES,
  MyExpenseCategory.COMMISSION,
  MyExpenseCategory.CRYPTOCURRENCY,
  MyExpenseCategory.EDUCATION,
  MyExpenseCategory.ENTERTAINMENT,
  MyExpenseCategory.FOOD,
  MyExpenseCategory.FOOD_ORDERING,
  MyExpenseCategory.GOODS,
  MyExpenseCategory.HOUSE,
  MyExpenseCategory.MEDICINE,
  MyExpenseCategory.MINING,
  MyExpenseCategory.MISCELLANEOUS_GOODS,
  MyExpenseCategory.MUSIC,
  MyExpenseCategory.OTHER,
  MyExpenseCategory.PRESENTS,
  MyExpenseCategory.REGULAR_HOUSE_COMMUNICATNION_BILLS,
  MyExpenseCategory.SPORT,
  MyExpenseCategory.SUBSCRIPTIONS,
  MyExpenseCategory.TRANSFERS,
  MyExpenseCategory.TRANSPORT,
  MyExpenseCategory.TRAVEL
].sort(
  (cat1, cat2) => {
    return cat1.toString().localeCompare(cat2.toString())
  }
)

const MY_INCOME_CATEGORIES_LIST = [
  MyIncomeCategory.ALM,
  MyIncomeCategory.PTI,
  MyIncomeCategory.DEPOSIT_SAVINGS_ACCOUNT_INTEREST,
  MyIncomeCategory.CASHBACK,
  MyIncomeCategory.STOCK_EXCHANGE,
  MyIncomeCategory.CRYPTOCURRENCY,
  MyIncomeCategory.OTHER,
]
