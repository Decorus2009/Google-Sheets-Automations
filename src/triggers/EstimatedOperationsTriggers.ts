
function maybeEstimatedMonthlyIncomesKeysEdited(e) {
  maybeEstimatedMonthlyIncomesOrExpensesKeysEdited(
    e,
    isEstimatedIncomesKeys,
    isLastMonthlyEstimatedIncomesKeysRangeCell,
    MONTHLY__ESTIMATED_INCOMES_VALUES_OFFSET_FROM_ESTIMATED_INCOMES_KEYS,
    MY_INCOME_CATEGORIES_LIST,
    false, // isPlanned column is not supported for 'estimated incomes column'
    undefined // shouldn't be reached
  )
}

function maybeEstimatedMonthlyIncomesValuesEdited(e) {
  maybeEstimatedMonthlyIncomesOrExpensesValuesEdited(
    e,
    isEstimatedIncomesValues,
    -MONTHLY__ESTIMATED_INCOMES_VALUES_OFFSET_FROM_ESTIMATED_INCOMES_KEYS // columnOffset = -1 (previous column will be taken down the code)
  )
}

function maybeEstimatedMonthlyExpensesKeysEdited(e) {
  maybeEstimatedMonthlyIncomesOrExpensesKeysEdited(
    e,
    isEstimatedExpensesKeys,
    isLastMonthlyEstimatedExpensesKeysRangeCell,
    MONTHLY__ESTIMATED_EXPENSES_VALUES_OFFSET_FROM_ESTIMATED_EXPENSES_KEYS,
    MY_EXPENSE_CATEGORIES_LIST,
    true, // 'is planned' column in included
    MONTHLY__IS_PLANNED_OFFSET_FROM_ESTIMATED_EXPENSES_KEYS
  )
}

function maybeEstimatedMonthlyExpensesValuesEdited(e) {
  maybeEstimatedMonthlyIncomesOrExpensesValuesEdited(
    e,
    isEstimatedExpensesValues,
    -MONTHLY__ESTIMATED_EXPENSES_VALUES_OFFSET_FROM_ESTIMATED_EXPENSES_KEYS // columnOffset = -1 (previous column will be taken down the code)
  )
}


// ======================================== PRIVATE ========================================
/**
 * Keys (aka income or expense) editing 
 */
function maybeEstimatedMonthlyIncomesOrExpensesKeysEdited(
  e,
  columnChecker: (range: GoogleAppsScript.Spreadsheet.Range) => boolean,
  lastCellChecker: (range: GoogleAppsScript.Spreadsheet.Range) => boolean,
  valuesColumnOffsetFromKeysColumn: number,
  selectableValuesList: any[],
  shouldProcessIsPlannedColumn: boolean,
  isPlannedColumnOffsetFromKeysColumn: number
) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range // keys range (e.g. ALM, ФТИ, ...)

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!columnChecker(rangeEdited)) {
    return
  }

  const newKey = rangeEdited.getValue()

  var rowOffset = 0
  var columnOffset = valuesColumnOffsetFromKeysColumn
  // same row, next column
  const valuesSingleCellRange = getSingleCellRange(rangeEdited, rowOffset, columnOffset) // income/expense amounts for corresponding income/expense categories
  const currentValue = valuesSingleCellRange.getDisplayValue()

  if (isEmpty(newKey)) {
    if (!isEmpty(currentValue)) {
      markAsWarning(rangeEdited)
    } else {
      // both key and value cell are empty -> remove coloring
      markAsManuallyHandled(rangeEdited)
      markAsManuallyHandled(valuesSingleCellRange)
    }
  }
  else {
    markAsManuallyHandled(rangeEdited)

    if (isEmpty(currentValue)) {
      markAsWarning(valuesSingleCellRange)
    }
  }

  if (lastCellChecker(rangeEdited)) {
    return
  }

  rowOffset = 1
  columnOffset = 0
  const nextRowSingleCellRange = getSingleCellRange(rangeEdited, rowOffset, columnOffset) // same column, next row

  makeSelectable(nextRowSingleCellRange, selectableValuesList)

  if (shouldProcessIsPlannedColumn) {
    makeCheckable(rangeEdited, isPlannedColumnOffsetFromKeysColumn)
  }
}

/**
 * Amount values editing
 */
function maybeEstimatedMonthlyIncomesOrExpensesValuesEdited(
  e,
  columnChecker: (range: GoogleAppsScript.Spreadsheet.Range) => boolean,
  keysColumnFromValuesColumnOffset: number,
) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range // keys range (e.g. ALM, ФТИ, ...)

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!columnChecker(rangeEdited)) {
    return
  }

  const newValue = rangeEdited.getDisplayValue()

  var rowOffset = 0
  var columnOffset = keysColumnFromValuesColumnOffset
  // same row, previous column
  const keysSingleCellRange = getSingleCellRange(rangeEdited, rowOffset, columnOffset) // income/expense categories (aka keys)

  // mark amounts cell as red with empty or invalid value only if a corresponding key (income/expense category) is not empty
  const outerCondition = !isEmpty(keysSingleCellRange.getDisplayValue())

  markAsWarningIfNotNumericOrEmptySingleCell(rangeEdited, outerCondition)
}

function isEstimatedIncomesKeys(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithSingleLetterAndIsInRowBounds(
    rangeEdited,
    MONTHLY__ESTIMATED_INCOMES_KEYS_LETTER,
    MONTHLY__KEYS_ROWS_LOWER_LIMIT,
    MONTHLY__KEYS_ROWS_UPPER_LIMIT
  )
}

function isEstimatedIncomesValues(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithSingleLetterAndIsInRowBounds(
    rangeEdited,
    MONTHLY__ESTIMATED_INCOMES_VALUES_LETTER,
    MONTHLY__KEYS_ROWS_LOWER_LIMIT,
    MONTHLY__KEYS_ROWS_UPPER_LIMIT
  )
}

function isEstimatedExpensesKeys(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithSingleLetterAndIsInRowBounds(
    rangeEdited,
    MONTHLY__ESTIMATED_EXPENSES_KEYS_LETTER,
    MONTHLY__KEYS_ROWS_LOWER_LIMIT,
    MONTHLY__KEYS_ROWS_UPPER_LIMIT
  )
}

function isEstimatedExpensesValues(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithSingleLetterAndIsInRowBounds(
    rangeEdited,
    MONTHLY__ESTIMATED_EXPENSES_VALUES_LETTER,
    MONTHLY__KEYS_ROWS_LOWER_LIMIT,
    MONTHLY__KEYS_ROWS_UPPER_LIMIT
  )
}


function isLastMonthlyEstimatedIncomesKeysRangeCell(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return rangeEdited.getA1Notation() === MONTHLY__ESTIMATED_INCOMES_KEYS_LETTER + MONTHLY__KEYS_ROWS_UPPER_LIMIT
}

function isLastMonthlyEstimatedExpensesKeysRangeCell(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return rangeEdited.getA1Notation() === MONTHLY__ESTIMATED_EXPENSES_KEYS_LETTER + MONTHLY__KEYS_ROWS_UPPER_LIMIT
}