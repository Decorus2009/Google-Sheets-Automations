/**
 * Different utilities to work with sheet, ranges, arrays, etc.
 */
 function getRangeText(lowerBoundLetter: string, startRowInd: number, upperBoundLetter: string, endRowInd: number): string {
  return lowerBoundLetter + startRowInd + ':' + upperBoundLetter + endRowInd
}

function getRange(rangeText: string): GoogleAppsScript.Spreadsheet.Range {
  return getActiveSpreadsheet().getRange(rangeText)
}

function getValues(rangeText: string): any[][] {
  return getRange(rangeText).getValues()
}

function getDisplayValues(rangeText: string): string[][] {
  return getRange(rangeText).getDisplayValues()
}

function setFontColor(rangeText: string, color: string) {
  getRange(rangeText).setFontColor(color);
}

function fillRange(range: GoogleAppsScript.Spreadsheet.Range, valuesArray: any[][]) {
  range.setValues(valuesArray)
  markAsProcessed(range)
}

/**
 * NB: there's a mathematical numbers comparisson, we have to cast parse number strings to numbers
 */
function inRange(lowerBound: number, upperBound: number, value: number): boolean {
  return value >= lowerBound && value <= upperBound
}

function getSingleCellRange(singleColumnRange: GoogleAppsScript.Spreadsheet.Range, rowOffset: number, columnOffset: number): GoogleAppsScript.Spreadsheet.Range {
  return getActiveSheet().getRange(singleColumnRange.getRow() + rowOffset, singleColumnRange.getColumn() + columnOffset, 1, 1)
}

function getFirstCellRange(range: GoogleAppsScript.Spreadsheet.Range): GoogleAppsScript.Spreadsheet.Range {
  return getSingleCellRange(range, 0, 0)
}

function isSingleCellRange(range: GoogleAppsScript.Spreadsheet.Range): boolean {
  return range.getNumRows() == 1 && range.getNumColumns() == 1
}


function markAsMissingOrUnprocessed(range: GoogleAppsScript.Spreadsheet.Range) {
  range.setBackground(MISSING_OR_WARNING_VALUE_CELL_BACKGROUND_COLOR)
  restoreStyle(range)
}

function markAsWarning(range: GoogleAppsScript.Spreadsheet.Range) {
  markAsMissingOrUnprocessed(range)
}

function markAsManuallyHandled(range: GoogleAppsScript.Spreadsheet.Range) {
  range.setBackground(MANUALLY_HANDLED_BACKGROUND_COLOR)
  restoreStyle(range)
}

function markAsProcessed(range: GoogleAppsScript.Spreadsheet.Range) {
  range.setBackground(PROCESSED_DATA_BACKGROUND_COLOR)
  restoreStyle(range)
}

function markAsPlannedOrNot(range: GoogleAppsScript.Spreadsheet.Range, isPlanned: boolean, isPlannedColor: string) {
  if (isPlanned) { 
    range.setBackground(isPlannedColor) 
  }
  else {
    range.setBackground(MANUALLY_HANDLED_BACKGROUND_COLOR) 
  }
  restoreStyle(range)
}

function setValueAndMarkAsProcessed(range: GoogleAppsScript.Spreadsheet.Range, value: any) {
  range.setValue(value)
  markAsProcessed(range)
}

function setValuesAndMarkAsProcessed(range: GoogleAppsScript.Spreadsheet.Range, values: any[]) {
  range.setValues(values)
  markAsProcessed(range)
}

function totalClear(range: GoogleAppsScript.Spreadsheet.Range) {
  range.clear() // clear previous values if any
  range.clearFormat() // clear previous format if any
  range.clearDataValidations() // clear previous format if any

  restoreStyle(range)
}

/**
 * Does not remove formatting rules set in the sheet (e.g. coloring for budget and balance values)
 */
function totalClearKeepFormatting(range: GoogleAppsScript.Spreadsheet.Range) {
  range.clear() // clear previous values if any
  range.clearDataValidations() // clear previous format if any

  restoreStyle(range)
}

function restoreStyle(range: GoogleAppsScript.Spreadsheet.Range) {
  range.setTextStyle(SpreadsheetApp.newTextStyle()
    .setFontFamily(FONT)
    .setFontSize(11)
    .build())
}

/**
 * Range to check must be of same columns as estimated incomes (exprenses) range, 
 * but might contain less rows
 */
function isFullWidthSubrange(
  range: GoogleAppsScript.Spreadsheet.Range, 
  parentRangeText: string
) {
  // range to check
  const startColumn = range.getColumn()
  const endColumn = getEndColumnOf(range)
  
  const startRow = range.getRow()
  const endRow = getEndRowOf(range)

  // estimated incomes (expenses) full range
  const estimatedFullRange = getRange(parentRangeText)
  
  const estimatedFullRangeStartColumn = estimatedFullRange.getColumn()
  const estimatedFullRangeEndColumn = getEndColumnOf(estimatedFullRange)

  const estimatedFullRangeStartRow = estimatedFullRange.getRow()
  const estimatedFullRangeEndRow = getEndRowOf(estimatedFullRange)

  // conditions
  function isInRowBounds(row: number): boolean {
    return row >= estimatedFullRangeStartRow && row <= estimatedFullRangeEndRow
  }

  const cc1 = startColumn === estimatedFullRangeStartColumn
  const cc2 = endColumn === estimatedFullRangeEndColumn

  const rc1 = isInRowBounds(startRow)
  const rc2 = isInRowBounds(endRow)

  return cc1 && cc2 && rc1 && rc2
}

function getEndColumnOf(range: GoogleAppsScript.Spreadsheet.Range): number {
  return range.getColumn() + range.getNumColumns() - 1
}

function getEndRowOf(range: GoogleAppsScript.Spreadsheet.Range): number {
  return range.getRow() + range.getNumRows() - 1
}



/**
 * @returns a single-column range defined by the @param columnOffset before @param initialRange
 */
 function getSingleColumnRangeBefore(
  initialRange: GoogleAppsScript.Spreadsheet.Range,
  columnOffset: number
): GoogleAppsScript.Spreadsheet.Range {
  const initialStartRowInd = initialRange.getRow()
  const initialStartColInd = initialRange.getColumn()
  const rangeToWriteResultColInd = initialStartColInd + columnOffset

  // single-column range before [initialRange]
  return getActiveSheet().getRange(initialStartRowInd, rangeToWriteResultColInd, initialRange.getNumRows(), 1)
}

/**
 * @returns a single-column range defined by the @param columnOffset after @param initialRange
 */
function getSingleColumnRangeAfter(
  initialRange: GoogleAppsScript.Spreadsheet.Range,
  columnOffset: number
): GoogleAppsScript.Spreadsheet.Range {
  const initialStartRowInd = initialRange.getRow()
  const initialEndColInd = initialRange.getColumn() + initialRange.getNumColumns() - 1
  // first column after filtered range if columnOffset == 1
  // or
  // second column after filtered range if columnOffset == 2
  const rangeToWriteResultColInd = initialEndColInd + columnOffset

  // single-column range
  return getActiveSheet().getRange(initialStartRowInd, rangeToWriteResultColInd, initialRange.getNumRows(), 1)
}

function getSingleColumnRangeFromEnd(range: GoogleAppsScript.Spreadsheet.Range, columnBackOffset: number): GoogleAppsScript.Spreadsheet.Range {
  return getActiveSheet().getRange(
    range.getRow(),
    range.getColumn() + range.getNumColumns() - (columnBackOffset + 1),
    range.getNumRows(),
    1
  )
}
