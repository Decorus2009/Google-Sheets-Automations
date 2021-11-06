function startsWith(range: GoogleAppsScript.Spreadsheet.Range, letter: string): boolean {
  return range.getA1Notation().startsWith(letter)
}

function startsWithAndIsInRowBounds(
  range: GoogleAppsScript.Spreadsheet.Range,
  letter: string,
  lowerBound: number,
  upperBound: number
): boolean {
  return startsWith(range, letter) && isInRowBounds(range, lowerBound, upperBound)
}

function startsWithSingleLetterAndIsInRowBounds(
  range: GoogleAppsScript.Spreadsheet.Range,
  letter: string,
  lowerBound: number,
  upperBound: number
): boolean {
  return startsWithSingleLetter(range, letter) && isInRowBounds(range, lowerBound, upperBound)
}

function startsWithSingleLetter(range: GoogleAppsScript.Spreadsheet.Range, letter: string): boolean {
  const a1Notation = range.getA1Notation()
  // require that range is e.g. A5, not AF5, startsWith('A') check is not valid
  return (a1Notation.charAt(0) === letter && isNumericString(a1Notation.charAt(1)))
}

function isInRowBounds(
  range: GoogleAppsScript.Spreadsheet.Range,
  lowerBound: number,
  upperBound: number
): boolean {
  function isInBounds(value: number, lowerBound: number, upperBound: number): boolean {
    return value >= lowerBound && value <= upperBound
  }

  const lowerRowNumber = range.getRow()
  const upperRowNumber = range.getRow() + range.getNumRows() - 1

  return isInBounds(lowerRowNumber, lowerBound, upperBound) && isInBounds(upperRowNumber, lowerBound, upperBound)
}

/**
 * For checking if a value in single-cell range is not empty and is a number. Mark appropriately
 */
function markAsWarningIfNotNumericOrEmptySingleCell(range: GoogleAppsScript.Spreadsheet.Range) {
  const newValue = range.getDisplayValue()

  if (isEmpty(newValue) || !isNumericString(newValue)) {
    markAsWarning(range)
  } else {
    markAsManuallyHandled(range)
  }
}

function getDataRowRange(rowInd: number, firstColumnLetter: string, lastColumnLetter: string): GoogleAppsScript.Spreadsheet.Range {
  return getRange(getRangeText(firstColumnLetter, rowInd, lastColumnLetter, rowInd)) 
}
