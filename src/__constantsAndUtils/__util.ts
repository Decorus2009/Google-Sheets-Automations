/**
 * These constants should be declared here because of their usage in functions below
 */


// monthly
const MONTHLY_HEADER_ROWS_LOWER_LIMIT = 2
const MONTHLY_HEADER_ROWS_UPPER_LIMIT = 2

const MONTHLY__KEYS_ROWS_LOWER_LIMIT = 3
const MONTHLY__KEYS_ROWS_UPPER_LIMIT = 32

const MONTHLY_OPERATION_TYPE_ROWS_LOWER_LIMIT = MONTHLY__KEYS_ROWS_LOWER_LIMIT
const MONTHLY_OPERATION_TYPE_ROWS_UPPER_LIMIT = MONTHLY__KEYS_ROWS_UPPER_LIMIT

// daily
const DAILY_AND_DATA_HEADER_ROWS_LOWER_LIMIT = 1
const DAILY_AND_DATA_HEADER_ROWS_UPPER_LIMIT = 2

const DAILY_ROWS_LOWER_LIMIT = 3
const DAILY_ROWS_UPPER_LIMIT = 33

// data (for both TINKOFF and OTHER)
const DATA_ROWS_LOWER_LIMIT = 3
const DATA_ROWS_UPPER_LIMIT = 250


// monthly 
function getMonthlyHeaderRangeText(lowerLetterBound: string, upperLeterBound: string): string {
  return lowerLetterBound + MONTHLY_HEADER_ROWS_LOWER_LIMIT.toString() + ":" + upperLeterBound + MONTHLY_HEADER_ROWS_UPPER_LIMIT.toString()
}

function getMonthlyKeysRangeText(letter: string): string {
  return letter + MONTHLY__KEYS_ROWS_LOWER_LIMIT.toString() + ":" + letter + MONTHLY__KEYS_ROWS_UPPER_LIMIT.toString()
}

function getMonthlyOperationTypeRangeText(lowerLetterBound: string, upperLeterBound: string): string {
  return lowerLetterBound + MONTHLY_OPERATION_TYPE_ROWS_LOWER_LIMIT.toString() + ":" + upperLeterBound + MONTHLY_OPERATION_TYPE_ROWS_UPPER_LIMIT.toString()
}


// daily
function getDailyRangeText(lowerLetterBound: string, upperLeterBound: string): string {
  return lowerLetterBound + DAILY_ROWS_LOWER_LIMIT.toString() + ":" + upperLeterBound + DAILY_ROWS_UPPER_LIMIT.toString()
}

function getDailySingleColumnRangeText(letter: string): string {
  return letter + DAILY_ROWS_LOWER_LIMIT.toString() + ":" + letter + DAILY_ROWS_UPPER_LIMIT.toString()
}

// header
function getHeaderRangeText(letter: string): string {
  return letter + DAILY_AND_DATA_HEADER_ROWS_LOWER_LIMIT + ":" + letter + DAILY_AND_DATA_HEADER_ROWS_UPPER_LIMIT
}

// data
function getDataRangeText(lowerLetterBound: string, upperLeterBound: string): string {
  return lowerLetterBound + DATA_ROWS_LOWER_LIMIT.toString() + ":" + upperLeterBound + DATA_ROWS_UPPER_LIMIT.toString()
}


function charAfter(letters: string, offset: number): string {
  if (offset === 0) {
    return letters
  }

  if (letters.length === 1 && letters[0] < INSTERTED_COLUMN_LETTER) {
    return charAfter(letters, offset - 1)
  }

  if (letters === SHEET_END_LETTER) {
    return letters
  }

  if (letters === 'Z') {
    return "AA"
  }

  if (letters === 'AZ') {
    return "BA"
  }

  if (letters.length > 2 && letters.length === 0) {
    throw "UNKNOWN RANGE FOUND: " + letters
  }

  if (letters.length === 1) {
    return String.fromCharCode(letters[0].charCodeAt(0) + offset)
  } else {
    const firstChar = letters[0]
    const lastChar = letters[1]
    return firstChar + String.fromCharCode(lastChar.charCodeAt(0) + offset)
  }
}

