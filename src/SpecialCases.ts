const MOLNIA_INITIAL_AMOUNT_ABS = 11 // 11 RUB freeze during molnia registration (one-time action)
const MOLNIA_REGULAR_AMOUNT_ABS = 250 // 250 RUB freeze during each molnia rent (repeatable action)
const MOLNIA_WHOOSH_MCC_CODE = 7999
const MOLNIA_DESCRIPTION = "MOLNIA"
const WHOOSH_DESCRIPTION = "WHOOSH"

const TINKOFF_PRO_DESCRIPTION = "Tinkoff Pro"
const TINKOFF_PRO_AMOUNT = -199

// Transport
function isTransport(entry: TinkoffDataRowEntry): boolean {
  return isMolniaEntry(entry) || isWhooshEntry(entry)
}

/**
 * There's a small probability that I can remove an entry 
 * for a true ride payment somehow equal to 250 RUB
 */
function isMolniaEntryToRemove(entry: TinkoffDataRowEntry): boolean {
  if (isMolniaEntry(entry)) {
    const absAmount = Math.abs(entry.rawAmout)
    if (inArray([MOLNIA_INITIAL_AMOUNT_ABS, MOLNIA_REGULAR_AMOUNT_ABS], absAmount)) {
      return true
    }
  }

  return false
}

/**
 * Molnia entry might be a candidate to remove or not if it's a regular operation (not +-250 RUB)
 */
function isMolniaEntry(e: TinkoffDataRowEntry): boolean {
  return e.rawMCC === MOLNIA_WHOOSH_MCC_CODE && e.rawDescription.toUpperCase() === MOLNIA_DESCRIPTION
}

/**
 * Molnia entry might be a candidate to remove or not if it's a regular operation (not +-250 RUB)
 */
 function isWhooshEntry(e: TinkoffDataRowEntry): boolean {
  return e.rawMCC === MOLNIA_WHOOSH_MCC_CODE && e.rawDescription.toUpperCase() === WHOOSH_DESCRIPTION
}

function isTinkoffProSubscription(e: TinkoffDataRowEntry): boolean {
  return e.rawAmout === TINKOFF_PRO_AMOUNT && e.rawTinkoffCategory === TinkoffCategory.OTHER_SERVICES_IB && e.rawDescription === EXPENSE_DESCRIPTION_SPECIAL_CASES.TINKOFF_PRO_DESCRIPTION
}

function isTinkoffBalanceInterest(e: TinkoffDataRowEntry): boolean {
  return e.rawAmout > 0 && e.rawTinkoffCategory === TinkoffCategory.OTHER && e.rawDescription === INCOME_DESCRIPTION_SPECIAL_CASES.BALANCE_INTEREST
}

function isTinkoffCashback(e: TinkoffDataRowEntry): boolean {
  return e.rawAmout > 0 && e.rawTinkoffCategory === TinkoffCategory.OTHER && e.rawDescription === INCOME_DESCRIPTION_SPECIAL_CASES.PURCHASE_REWARD
}

function isAppStoreITunesSubscription(e: TinkoffDataRowEntry): boolean {
  return e.rawAmout < 0 
    && e.rawTinkoffCategory === TinkoffCategory.OTHER_OPERATIONS 
    && e.rawDescription === EXPENSE_DESCRIPTION_SPECIAL_CASES.APPSTORE_ITUNES
    && e.rawMCC === 5815
}

function isRostelecomInternetPayment(e: TinkoffDataRowEntry): boolean {
  return e.rawAmout < 0 && e.rawTinkoffCategory === TinkoffCategory.INTERNET_VOIP_IB && e.rawDescription.includes("Ростелеком")
}

function isMtsMobile(e: TinkoffDataRowEntry): boolean {
  return e.rawAmout < 0 && e.rawTinkoffCategory === TinkoffCategory.MOBILE_IB && e.rawDescription.includes("МТС Mobile")
}

function isMealty(e: TinkoffDataRowEntry): boolean {
  return e.rawAmout < 0 && e.rawTinkoffCategory === TinkoffCategory.FAST_FOOD && e.rawDescription === "Милти" && e.rawMCC === 5814
}

// seems to be a transfer by a card number (transfers by a phone number don't contain mcc)
// the idea it to return TinkoffCategory.UNKNOWN in order to manually handle this case
function isTransferByCardNumber(e: TinkoffDataRowEntry): boolean {
  return e.rawAmout < 0 && e.rawDescription === "Перевод на карту" && e.rawMCC === 6012
}