type MyCategory = MyIncomeCategory | MyExpenseCategory


/**
 * 1. filters initial range and keeps filtered range coordinates and filtered display values
 * 2. clears initial range
 * 3. fills a new filtered range with filtered display values
 * 
 * E.g. initial range: 'A3:B250', filtered range: 'A3:B65'
 * @returns filtered range
 */
function filterAndFillRange(rangeText: string, filterPredicate: (row: any[]) => boolean): GoogleAppsScript.Spreadsheet.Range {
  const filteredValuesAndRange = getFilteredDisplayValuesAndRange(rangeText, filterPredicate)
  const filteredValues = filteredValuesAndRange[0]
  const filteredRange = filteredValuesAndRange[1]

  const initialRange = getRange(rangeText)

  initialRange.clear()
  filteredRange.setValues(filteredValues)

  return filteredRange
}

/**
 * @returns a tuple of filtered display values and a range to write these values later. Does not clear old range
 * 
 * NB: filtered range is not filled with filtered values
 */
function getFilteredDisplayValuesAndRange(rangeText: string, filterPredicate: (row: any[]) => boolean): [string[][], GoogleAppsScript.Spreadsheet.Range] {
  const values = getDisplayValues(rangeText)
  const filteredDisplayValues = values.filter(filterPredicate)

  const range = getRange(rangeText)
  const startRowInd = range.getRow()
  const endRowInd = startRowInd + filteredDisplayValues.length - 1

  // letter bounds
  const letterBounds = getLetterBounds(rangeText)
  const lowerBoundLetter = letterBounds[0]
  const upperBoundLetter = letterBounds[1]

  // e.g. range was 'U3:AI999', became 'U3:AI10'
  const filteredRangeText = getRangeText(lowerBoundLetter, startRowInd, upperBoundLetter, endRowInd)
  const filteredRange = getRange(filteredRangeText)

  return [filteredDisplayValues, filteredRange]
}

function formatValuesCells(dataRange: GoogleAppsScript.Spreadsheet.Range) {
  dataRange.setVerticalAlignment("middle")

  const style = SpreadsheetApp.newTextStyle()
    .setFontFamily(FONT)
    .setFontSize(11)
    .build()

  dataRange.setTextStyle(style)
}

function isCompensation(value: any): boolean {
  return value === OperationType.COMPENSATION
}

function isTransfer(value: any): boolean {
  return value === OperationType.TRANSFER
}

function isExpenseOrCompensation(value: any): boolean {
  return [OperationType.EXPENSE, OperationType.COMPENSATION].includes(value)
}

function isIncomeOrExpenseOrCompensation(value: any): boolean {
  return [OperationType.INCOME, OperationType.EXPENSE, OperationType.COMPENSATION].includes(value)
}

function dropdownValidationRule(valuesList: string[]): GoogleAppsScript.Spreadsheet.DataValidation {
  return SpreadsheetApp.newDataValidation().requireValueInList(valuesList, true).build()
}

function dateValidationRule(): GoogleAppsScript.Spreadsheet.DataValidation {
  return SpreadsheetApp.newDataValidation().requireDate().build()
}

function setAllowedOrWarningFormatting(range: GoogleAppsScript.Spreadsheet.Range) {
  const sheet = getActiveSheet();

  const lessThanZeroRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0)
    .setBackground(MISSING_OR_WARNING_VALUE_CELL_BACKGROUND_COLOR)
    .setRanges([range])
    .build()

  const greaterThanZeroRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0)
    .setBackground(ALLOWED_VALUE_CELL_BACKGROUND_COLOR)
    .setRanges([range])
    .build()

  var rules = sheet.getConditionalFormatRules()
  rules.push(lessThanZeroRule)
  rules.push(greaterThanZeroRule)
  sheet.setConditionalFormatRules(rules)
}

function makeCheckable(range: GoogleAppsScript.Spreadsheet.Range, columnOffset: number) {
  const singleColumnRange = getActiveSheet().getRange(
    range.getRow(),
    range.getColumn() + columnOffset,
    range.getNumRows(),
    1
  )

  singleColumnRange.insertCheckboxes()
}

function formatAllValues() {
  formatValuesCells(getRange(ALL_SHEET_VALUES_RANGE_TEXT))

  // additional formatting for aux range: total income, savings, daily budget
  const auxRange = getRange(AUX_RANGE_TEXT)
  const auxSavingsHeaderRange = getRange(AUX_SAVINGS_HEADER_RANGE_TEXT)
  const auxSavingsRange = getRange(AUX_SAVINGS_RANGE_TEXT)

  auxRange.setTextStyle(SpreadsheetApp.newTextStyle()
    .setFontFamily(FONT)
    .setFontSize(16)
    .build())
    
  auxSavingsRange.setTextStyle(SpreadsheetApp.newTextStyle()
    .setFontFamily(FONT)
    .setFontSize(11)
    .setBold(true)
    .build())

  // auxSavingsHeaderRange.setTextStyle(SpreadsheetApp.newTextStyle()
  //   .setFontFamily(FONT)
  //   .setFontSize(12)
  //   .build())
}


function makeMyCategoriesSelectableAccordingTo(
  operationTypeValue: string, 
  myCategoryValue: string, 
  operationTypeSingleCellRange: GoogleAppsScript.Spreadsheet.Range,
  myCategorySingleCellRange: GoogleAppsScript.Spreadsheet.Range
) {
  // highlight cell with missing value for 'my category' for 'income operation' which is impossible to define 
  // (e.g. transfer by phone number for goods/food)
  if (isIncomeOrExpenseOrCompensation(operationTypeValue) && isEmpty(myCategoryValue)) {
    markAsMissingOrUnprocessed(myCategorySingleCellRange)
  }

  var categoryRule = undefined

  if (operationTypeValue === OperationType.INCOME) {
    categoryRule = dropdownValidationRule(MY_INCOME_CATEGORIES_LIST)
  }
  else if (isExpenseOrCompensation(operationTypeValue)) {
    categoryRule = dropdownValidationRule(MY_EXPENSE_CATEGORIES_LIST)
  }
  else {
    categoryRule = null; // remove dropdown

    if (isEmpty(operationTypeValue)) {
      markAsMissingOrUnprocessed(operationTypeSingleCellRange)
      markAsMissingOrUnprocessed(myCategorySingleCellRange)  
    }
  }

  myCategorySingleCellRange.setDataValidation(categoryRule)
}
