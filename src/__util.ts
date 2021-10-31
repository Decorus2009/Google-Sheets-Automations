/**
 * Different utilities to work with sheet, ranges, arrays, etc.
 */


function getActiveSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
  return SpreadsheetApp.getActiveSpreadsheet()
}

function getActiveSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  return getActiveSpreadsheet().getActiveSheet()
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

// ======================================= arrays ======================================= 
/**result 2d @param array size (both rows num and cols num) should match @param targetLength */
function extend(array: string[][], targetLength: number, dummyElement: string) {
  while (array.length < targetLength) {
    addElementAsArrayTo(array, dummyElement)
  }
}

function extendWithTwoElements(array: string[][], targetLength: number, dummyElement1: string, dummyElement2: string) {
  while (array.length < targetLength) {
    addElementsAsArrayTo(array, dummyElement1, dummyElement2)
  }
}

function extendAndFillUsingRangeText(
  array: string[][],
  rangeText: string,
  dummyElement: string
) {
  const rangeToWriteResult = getRange(rangeText)

  extend(array, rangeToWriteResult.getNumRows(), dummyElement)
  fillRange(rangeToWriteResult, array)
}

function extendAndFillUsingRange(
  array: string[][],
  range: GoogleAppsScript.Spreadsheet.Range,
  dummyElement: string
) {
  extend(array, range.getNumRows(), dummyElement)
  fillRange(range, array)
}

/**
 * Range represents a 2d array (for a single column as well)
 * Main array corresponds to rows. Each element of that array is an array itself (even if it's corresponds to a single cell)
 */
function addElementAsArrayTo(array: string[][], element: string) {
  array.push([element]) // add element wrapped into array
}

function addElementsAsArrayTo(array: string[][], element1: string, element2: string) {
  array.push([element1, element2])
}

function inArray(array: any[], value: any): boolean {
  return array.includes(value)
}

/**
 * NB: there's a mathematical numbers comparisson, we have to cast parse number strings to numbers
 */
function inRange(lowerBound: number, upperBound: number, value: number): boolean {
  return value >= lowerBound && value <= upperBound
}

function isNumber(value: any): boolean {
  return typeof value === 'number'
}

function asNumber(value: string): number {
  // toString call is mandatory because this method throws when reading true numbers from table,
  // there's no 'replace' method on number;
  // e.g. works for -198,00 (string) but fails for -198 (number)
  return parseFloat(value.toString().replace(',', '.'))
}

function asBoolean(value: string): boolean {
  if (!value) return false

  const strValue = value.toString().toUpperCase()
  if (strValue === 'TRUE') return true
  if (strValue === 'FALSE') return false
  return false
}

function isEmpty(value: string): boolean {
  return value === ''
}

function isEmptyTrimSpaces(value: string): boolean {
  return value.trim() === ''
}

function isNumericString(value: string): boolean {
  return /^[+-]?\d+(\.\d+)?$/.test(value)
}

function getLetterBounds(rangeText: string): string[] {
  const tags = rangeText.match(/([A-Z]+)\d+:([A-Z]+)\d+/)
  return [tags[1], tags[2]]
}

// e.g. 02.10.2021 19:22
function extractDateFromTinkoffDateTime(dateTime: string): string {
  return dateTime.split(' ')[0]
}


function getSingleCellRange(singleColumnRange: GoogleAppsScript.Spreadsheet.Range, rowOffset: number, columnOffset: number): GoogleAppsScript.Spreadsheet.Range {
  return getActiveSheet().getRange(singleColumnRange.getRow() + rowOffset, singleColumnRange.getColumn() + columnOffset, 1, 1)
}

function getFirstCellRange(range: GoogleAppsScript.Spreadsheet.Range): GoogleAppsScript.Spreadsheet.Range {
  return getSingleCellRange(range, 0, 0)
}

/**
 * It's suggested that this range looks like 'AL3', not like 'AL3:AM3'
 */
function getSingleCellLetter(rangeText: string): string {
  const tags = rangeText.match(/([A-Z]+)\d+/)

  // if (tags.length > 2) {
  //   return '' // maybe this range is not of 'AL3' type, but of 'AL3:AM3' type
  // }
  return tags[1]
}

function isSingleCellRange(range: GoogleAppsScript.Spreadsheet.Range): boolean {
  return range.getNumRows() == 1 && range.getNumColumns() == 1
}

function getRangeText(lowerBoundLetter: string, startRowInd: number, upperBoundLetter: string, endRowInd: number): string {
  return lowerBoundLetter + startRowInd + ':' + upperBoundLetter + endRowInd
}

function markAsMissingOrUnprocessed(range: GoogleAppsScript.Spreadsheet.Range) {
  range.setBackground(MISSING_OR_WARNING_VALUE_CELL_BACKGROUND_COLOR)
}

function markAsWarning(range: GoogleAppsScript.Spreadsheet.Range) {
  markAsMissingOrUnprocessed(range)
}

function markAsManuallyHandled(range: GoogleAppsScript.Spreadsheet.Range) {
  range.setBackground(MANUALLY_HANDLED_BACKGROUND_COLOR)
}

function markAsProcessed(range: GoogleAppsScript.Spreadsheet.Range) {
  range.setBackground(PROCESSED_DATA_BACKGROUND_COLOR)
}

function markAsPlannedOrNot(range: GoogleAppsScript.Spreadsheet.Range, isPlanned: boolean, isPlannedColor: string) {
  if (isPlanned) { 
    range.setBackground(isPlannedColor) 
  }
  else {
    range.setBackground(MANUALLY_HANDLED_BACKGROUND_COLOR) 
  }
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
}

/**
 * Does not remove formatting rules set in the sheet (e.g. coloring for budget and balance values)
 */
function totalClearKeepFormatting(range: GoogleAppsScript.Spreadsheet.Range) {
  range.clear() // clear previous values if any
  range.clearDataValidations() // clear previous format if any
}

function DEBUG(value: any) {
  Logger.log(value.toString())
} 