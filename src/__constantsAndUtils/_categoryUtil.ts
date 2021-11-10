function tinkoffCategoriesToMyExpenseCategories(): Map<TinkoffCategory, MyExpenseCategory> {
  const map = new Map<TinkoffCategory, MyExpenseCategory>()

  map.set(TinkoffCategory.FLIGHTS,               MyExpenseCategory.TRAVEL)
  map.set(TinkoffCategory.CAR_SERVICES,          MyExpenseCategory.OTHER)
  map.set(TinkoffCategory.PHARMACY,              MyExpenseCategory.MEDICINE)
  map.set(TinkoffCategory.CAR_RENT,              MyExpenseCategory.OTHER) // alias: Транспорт или Путешествия
  map.set(TinkoffCategory.HOUSE_RENOVATION,      MyExpenseCategory.HOUSE)
  map.set(TinkoffCategory.TRAIN_TICKETS,         MyExpenseCategory.TRANSPORT) // alias: Путешествия
  map.set(TinkoffCategory.ANIMALS,               MyExpenseCategory.OTHER)
  map.set(TinkoffCategory.ART,                   MyExpenseCategory.ENTERTAINMENT)
  map.set(TinkoffCategory.CINEMA,                MyExpenseCategory.ENTERTAINMENT)
  map.set(TinkoffCategory.BEAUTY,                MyExpenseCategory.MISCELLANEOUS_GOODS)
  map.set(TinkoffCategory.MEDICAL_SERVICES,      MyExpenseCategory.MEDICINE)
  map.set(TinkoffCategory.MUSIC,                 MyExpenseCategory.MUSIC)
  map.set(TinkoffCategory.CASH,                  MyExpenseCategory.CASH)
  map.set(TinkoffCategory.NCO,                   MyExpenseCategory.CHARITY)
  map.set(TinkoffCategory.EDUCATION,             MyExpenseCategory.EDUCATION)
  map.set(TinkoffCategory.CLOTHES_SHOES,         MyExpenseCategory.CLOTHES)
  map.set(TinkoffCategory.HOTELS,                MyExpenseCategory.TRAVEL)
  map.set(TinkoffCategory.BUDGET_PAYMENTS,       MyExpenseCategory.BUDGET_PAYMENTS)
  map.set(TinkoffCategory.ENTERTAINMENT,         MyExpenseCategory.ENTERTAINMENT)
  map.set(TinkoffCategory.MISCELLANEOUS_GOODS,   MyExpenseCategory.MISCELLANEOUS_GOODS)
  map.set(TinkoffCategory.RESTAURANTS,           MyExpenseCategory.CAFE)
  map.set(TinkoffCategory.COMMUNICATION_TELECOM, MyExpenseCategory.REGULAR_HOUSE_COMMUNICATNION_BILLS)
  map.set(TinkoffCategory.SERVICE,               MyExpenseCategory.OTHER)
  map.set(TinkoffCategory.SPORT,                 MyExpenseCategory.SPORT)
  map.set(TinkoffCategory.SOUVENIRS,             MyExpenseCategory.OTHER)
  map.set(TinkoffCategory.SUPERMARKETS,          MyExpenseCategory.FOOD)
  map.set(TinkoffCategory.FUEL,                  MyExpenseCategory.OTHER)
  map.set(TinkoffCategory.TRANSPORT,             MyExpenseCategory.TRANSPORT) // alias: Путешествия
  map.set(TinkoffCategory.TRAVEL_AGENCIES,       MyExpenseCategory.TRAVEL)
  map.set(TinkoffCategory.FAST_FOOD,             MyExpenseCategory.CAFE)
  map.set(TinkoffCategory.FINANCIAL_SERVICES,    MyExpenseCategory.OTHER)
  map.set(TinkoffCategory.PHOTO_VIDEO,           MyExpenseCategory.OTHER)
  map.set(TinkoffCategory.FLOWERS,               MyExpenseCategory.OTHER)
  map.set(TinkoffCategory.PRIVATE_SERVICES,      MyExpenseCategory.OTHER)
  map.set(TinkoffCategory.DUTY_FREE,             MyExpenseCategory.TRAVEL)

  return map
}

/**
 * There're 2 codes which might fail: 
 * 0742 and 0011 (numbers are not allowed to start with '0'). 
 * Currently they are shown in arrays below as 742 and 11
 * 
 * If such a code is shown as a number in T-f *.csv file (in Excel and in Google Sheets hence), 
 * it's ok because it would be read as a number without '0' at the beginning
 */
function tinkoffCategoryFrom(mcc: number): TinkoffCategory {
  // empty cell without a code is interpreted as NaN
  if (isNaN(mcc)) {
    return TinkoffCategory.UNKNOWN
  }
 
  const numberCode = mcc as number
 
  if (
    inRange(3000, 3350, numberCode)
    || inArray([4304, 4415], numberCode)
    || inArray([4418, 4511, 4582], numberCode)
  ) return TinkoffCategory.FLIGHTS

  if (
    inRange(5531, 5533, numberCode)
    || inArray([5511, 5521, 5571], numberCode)
    || inArray([7012, 7531, 7534, 7535], numberCode)
    || inArray([7538, 7542, 7549], numberCode)
  ) return TinkoffCategory.CAR_SERVICES

  if (inArray([5122, 5292, 5295, 5912], numberCode))
    return TinkoffCategory.PHARMACY

  if (
    inRange(3351, 3398, numberCode)
    || inRange(3400, 3439, numberCode)
    || inArray([3441], numberCode)
    || inArray([7512, 7513, 7519], numberCode)
  ) return TinkoffCategory.CAR_RENT

  if (
    inArray([1520, 1711, 1731, 1740, 1750, 1761], numberCode)
    || inArray([1771, 1799, 2791, 2842, 5021, 5039], numberCode)
    || inArray([5046, 5051, 5065, 5072, 5074, 5085], numberCode)
    || inArray([5198, 5200, 5211, 5231, 5251, 5261], numberCode)
    || inRange(5712, 5714, numberCode)
    || inArray([5415, 5718, 5719, 5722, 7622], numberCode)
    || inArray([7623, 7629, 7641, 7692, 7699], numberCode)
  ) return TinkoffCategory.HOUSE_RENOVATION

  if (inArray([4011, 4112], numberCode))
    return TinkoffCategory.TRAIN_TICKETS

  if (inArray([742, 5995], numberCode))
    return TinkoffCategory.ANIMALS  // TODO orginal MCC code: 0742

  if (
    inRange(5970, 5973, numberCode)
    || inArray([5932, 5937], numberCode)
  ) return TinkoffCategory.ART

  if (inArray([7829, 7832, 7841], numberCode))
    return TinkoffCategory.CINEMA

  if (inArray([5977, 7230, 7297, 7998], numberCode))
    return TinkoffCategory.BEAUTY

  if (
    inArray([4119, 5047, 5296, 5975], numberCode)
    || inArray([5976, 8011, 8021, 8031], numberCode)
    || inRange(8041, 8044, numberCode)
    || inArray([8049, 8050, 8062], numberCode)
    || inArray([8071, 8099, 8351, 8676], numberCode)
  ) return TinkoffCategory.MEDICAL_SERVICES

  if (inArray([5733, 5735], numberCode))
    return TinkoffCategory.MUSIC

  if (inArray([6010, 6011], numberCode))
    return TinkoffCategory.CASH

  if (
    inArray([8398, 8641, 8651, 8661], numberCode)
    || inArray([8675, 8699, 8734, 8911], numberCode)
    || inArray([8931, 8999], numberCode)
  ) return TinkoffCategory.NCO

  if (
    inArray([8211, 8220, 8241, 8244], numberCode)
    || inArray([8249, 8299, 8493, 8494], numberCode)
  ) return TinkoffCategory.EDUCATION

  if (
    inArray([5094, 5137, 5139, 5611], numberCode)
    || inArray([5621, 5631, 5641, 5651], numberCode)
    || inRange(5697, 5699, numberCode)
    || inArray([5661, 5681, 5691], numberCode)
    || inArray([5931, 5944, 5949, 5950], numberCode)
    || inArray([7196, 7631], numberCode)
  ) return TinkoffCategory.CLOTHES_SHOES

  if (
    inRange(3501, 3827, numberCode)
    || inArray([7011, 7032, 7033], numberCode)
  ) return TinkoffCategory.HOTELS

  if (
    inRange(9311, 9314, numberCode)
    || inArray([9211, 9222, 9223, 9399], numberCode)
    || inArray([9402, 9405, 9751, 9752, 9950], numberCode)
  ) return TinkoffCategory.BUDGET_PAYMENTS

  if (
    inArray([7911, 7922, 7929, 7932, 7933], numberCode)
    || inRange(7991, 7994, numberCode)
    || inRange(7996, 7999, numberCode)
    || inArray([7941, 8664], numberCode)
  ) return TinkoffCategory.ENTERTAINMENT

  if (
    inArray([5099, 5131, 5169, 5310], numberCode)
    || inArray([5311, 5331, 5339, 5732], numberCode)
    || inArray([5734, 5933, 5935, 5943], numberCode)
    || inArray([5945, 5948, 5978, 5993], numberCode)
    || inRange(5996, 5999, numberCode)
    || inArray([7278, 7280], numberCode)
  ) return TinkoffCategory.MISCELLANEOUS_GOODS

  if (inRange(5811, 5813, numberCode))
    return TinkoffCategory.RESTAURANTS

  if (
    inRange(4812, 4816, numberCode)
    || inRange(4896, 4899, numberCode)
    || inArray([4821, 4829], numberCode)
    || inArray([4901, 4902, 7372, 7375], numberCode)
    || inArray([7479, 7894], numberCode)
  ) return TinkoffCategory.COMMUNICATION_TELECOM

  if (
    inArray([763, 780, 4214, 4215, 4225, 5199], numberCode)
    || inRange(5960, 5969, numberCode)
    || inArray([5299, 5301, 5543, 5544, 7013], numberCode)
    || inArray([7210, 7211, 7216, 7217, 7221, 7251], numberCode)
    || inArray([7311, 7321, 7341, 7342, 7349, 7361], numberCode)
    || inRange(7392, 7394, numberCode)
    || inArray([7399, 7407, 8111], numberCode)
  ) return TinkoffCategory.SERVICE

  if (inArray([5655, 5940, 5941], numberCode))
    return TinkoffCategory.SPORT

  if (inArray([5947], numberCode))
    return TinkoffCategory.SOUVENIRS

  if (
    inArray([5297, 5298, 5300, 5411], numberCode)
    || inArray([5412, 5422, 5441, 5451], numberCode)
    || inArray([5462, 5499, 5715, 5921], numberCode)
  ) return TinkoffCategory.SUPERMARKETS

  if (
    inArray([5172, 5541], numberCode)
    || inArray([5542, 5983], numberCode)
  ) return TinkoffCategory.FUEL

  if (
    inArray([11, 4111, 4121, 4131, 4457, 4468], numberCode) // TODO orginal MCC code: 0011
    || inArray([4784, 4789, 5013, 5271, 5551, 5561], numberCode)
    || inArray([5592, 5598, 5599, 7511, 7523], numberCode)
  ) return TinkoffCategory.TRANSPORT

  if (
    inArray([4411, 4416, 4417, 4419], numberCode)
    || inArray([4722, 4723, 4761, 7015], numberCode)
  ) return TinkoffCategory.TRAVEL_AGENCIES


  if (inArray([5814], numberCode))
    return TinkoffCategory.FAST_FOOD

  if (
    inArray([5416, 5417, 6012, 6050], numberCode)
    || inArray([6051, 6211, 6300, 6381], numberCode)
    || inRange(6529, 6538, numberCode)
    || inArray([6399, 6513, 6540], numberCode)
    || inArray([6611, 6760, 7322, 9411], numberCode)
  ) return TinkoffCategory.FINANCIAL_SERVICES

  if (
    inArray([5544, 5045, 5946, 7332], numberCode)
    || inArray([7333, 7338, 7339, 7395], numberCode)
  ) return TinkoffCategory.PHOTO_VIDEO

  if (inArray([5193, 5992], numberCode))
    return TinkoffCategory.FLOWERS

  if (
    inArray([7014, 7261, 7273, 7276], numberCode)
    || inArray([7277, 7295, 7299], numberCode)
  ) return TinkoffCategory.PRIVATE_SERVICES

  if (inArray([5309], numberCode))
    return TinkoffCategory.DUTY_FREE


  // codes not present in Tinkoff pdf
  if (inArray([5815], numberCode))
    return TinkoffCategory.OTHER_OPERATIONS


  throw "Unknown code " + numberCode
}
