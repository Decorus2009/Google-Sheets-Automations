const TINKOFF__IS_PLANNED_LETTER =                     charAfter('W',  INSTERTED_COLUMNS_NUMBER)
const TINKOFF__OPERATION_DATE_LETTER =                 charAfter('X',  INSTERTED_COLUMNS_NUMBER)
const TINKOFF__PAYMENT_DATE_LETTER =                   charAfter('Y',  INSTERTED_COLUMNS_NUMBER)
const TINKOFF__CARD_NUMBER_LETTER =                    charAfter('Z', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__STATUS_LETTER =                         charAfter('AA', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__OPERATION_AMOUNT_LETTER =               charAfter('AB', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__OPERATION_CURRENCY_LETTER =             charAfter('AC', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__PAYMENT_AMOUNT_LETTER =                 charAfter('AD', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__PAYMENT_CURRENCY_LETTER =               charAfter('AE', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__CASHBACK_LETTER =                       charAfter('AF', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__CATEGORY_LETTER =                       charAfter('AG', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__MCC_LETTER =                            charAfter('AH', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__DESCRIPTION_LETTER =                    charAfter('AI', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__BONUS_INCLUDING_CACHBACK_LETTER =       charAfter('AJ', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__INVEST_ROUNDING_LETTER =                charAfter('AK', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__OPERATION_AMOUNT_WITH_ROUNDING_LETTER = charAfter('AL', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__OPERATION_TYPE_LETTER =                 charAfter('AM', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__MY_CATEGORY_LETTER =                    charAfter('AN', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__MANUAL_EDITING_INFO_LETTER =            charAfter('AO', INSTERTED_COLUMNS_NUMBER)
const TINKOFF__COMMENT_LETTER =                        charAfter('AP', INSTERTED_COLUMNS_NUMBER)

const TINKOFF__FIRST_COLUMN_LETTER = TINKOFF__IS_PLANNED_LETTER
const TINKOFF__LAST_COLUMN_LETTER = TINKOFF__COMMENT_LETTER

const TINKOFF__DATA_RANGE_TEXT =                           getDataRangeText(TINKOFF__FIRST_COLUMN_LETTER, TINKOFF__LAST_COLUMN_LETTER)
const TINKOFF__OPERATION_TYPE_AND_MY_CATEGORY_RANGE_TEXT = getDataRangeText(TINKOFF__OPERATION_TYPE_LETTER, TINKOFF__MY_CATEGORY_LETTER)


// TODO refactor using POS

// offsets and positions
// Tinkoff table data values positions (0-based)
const TINKOFF__IS_PLANNED_POS =            0
const TINKOFF__DATE_TIME_POS =             1
const TINKOFF__STATUS_POS =                4
// other columns skipped/hidden           
const TINKOFF__AMOUNT_POS =                5
const TINKOFF__PAYMENT_AMOUNT_POS =        7 // hidden
// other columns skipped/hidden    
const TINKOFF__TINKOFF_CATEGORY_POS =     10
const TINKOFF__MCC_POS =                  11
const TINKOFF__DESCRIPTION_POS =          12
const TINKOFF__BONUSES_POS =              13 // hidden
const TINKOFF__INVESTMENT_ROUNDING__POS = 14 // hidden
const TINKOFF__AMOUNT_ROUNDED_POS =       15 // hidden
const TINKOFF__OPERATION_TYPE_POS =       16
const TINKOFF__MY_CATEGORY_POS =          17
const TINKOFF__MANUAL_EDITING_INFO_POS =  18
const TINKOFF__COMMENT_POS =              19

const TINKOFF__IS_PLANNED_COLUMN_BACK_OFFSET =     19
const TINKOFF__OPERATION_TYPE_COLUMN_BACK_OFFSET =      3
const TINKOFF__MY_CATEGORY_COLUMN_BACK_OFFSET =         2
const TINKOFF__MANUAL_EDITING_INFO_COLUMN_BACK_OFFSET = 1

const TINKOFF__MY_CATEGORIES_OFFSET_FROM_OPERATION_TYPE =      1 // 'my categories' is a right neighbor column to 'operation type'
const TINKOFF__MANUAL_EDITING_INFO_OFFSET_FROM_MY_CATEGORIES = 1 // 'manual editing info' is a right neighbor column to 'my categories'
const TINKOFF__MANUAL_EDITING_INFO_OFFSET_FROM_IS_PLANNED =   18 // 'manual editing info' is far away at 18th place to the right from 'is planned' column

// util
function getTinkoffDataIsPlanned(tinkoffDataValues: any[]): boolean {
  return asBoolean(tinkoffDataValues[TINKOFF__IS_PLANNED_POS])
}

function getTinkoffDataDateTime(tinkoffDataValues: any[]): any {
  return tinkoffDataValues[TINKOFF__DATE_TIME_POS]
}

function getTinkoffDataStatus(tinkoffDataValues: any[]): any {
  return tinkoffDataValues[TINKOFF__STATUS_POS]
}

function getTinkoffDataAmount(tinkoffDataValues: any[]): any {
  return tinkoffDataValues[TINKOFF__AMOUNT_POS]
}

function getTinkoffDataTinkoffCategory(tinkoffDataValues: any[]): any {
  return tinkoffDataValues[TINKOFF__TINKOFF_CATEGORY_POS]
}

function getTinkoffDataMCC(tinkoffDataValues: any[]): any {
  return tinkoffDataValues[TINKOFF__MCC_POS]
}

function getTinkoffDataDescription(tinkoffDataValues: any[]): any {
  return tinkoffDataValues[TINKOFF__DESCRIPTION_POS]
}

function getTinkoffDataOperationType(tinkoffDataValues: any[]): any {
  return tinkoffDataValues[TINKOFF__OPERATION_TYPE_POS]
}

function getTinkoffDataMyCategory(tinkoffDataValues: any[]): any {
  return tinkoffDataValues[TINKOFF__MY_CATEGORY_POS]
}

function getTinkoffDataManualEditingInfo(tinkoffDataValues: any[]): any {
  return tinkoffDataValues[TINKOFF__MANUAL_EDITING_INFO_POS]
}
  