const INSTERTED_COLUMNS_NUMBER = 0
const INSTERTED_COLUMN_LETTER = 'I'
 
// all sheet
const SHEET_START_LETTER = charAfter('A', INSTERTED_COLUMNS_NUMBER)
const SHEET_END_LETTER =   charAfter('AX', INSTERTED_COLUMNS_NUMBER)


const ALL_SHEET_VALUES_RANGE_TEXT = getDataRangeText(SHEET_START_LETTER, SHEET_END_LETTER)

const FONT = "Verdana"

const TIME_ZONE = "GMT+3"
const DATE_FORMAT = "dd.MM.yyyy"