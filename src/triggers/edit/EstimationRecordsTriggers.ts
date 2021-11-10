
function maybeEstimatedMonthlyIncomesKeysEdited(e) {
  maybeEstimatedKeysEdited(
    e,
    isEstimatedIncomesKeys,
    MONTHLY__ESTIMATED_INCOMES_VALUES_FROM_KEYS_OFFSET,
    MY_INCOME_CATEGORIES_LIST,
    false, // isPlanned column is not supported for 'estimated incomes'
    undefined // shouldn't be reached
  )
}

function maybeEstimatedMonthlyIncomesValuesEdited(e) {
  maybeEstimatedValuesEdited(
    e,
    isEstimatedIncomesValues,
    -MONTHLY__ESTIMATED_INCOMES_VALUES_FROM_KEYS_OFFSET, // columnOffset = -1 (previous column will be taken down the code)
    MY_INCOME_CATEGORIES_LIST,
    false, // isPlanned column is not supported for 'estimated incomes'
    undefined // shouldn't be reached
 )
}

function maybeEstimatedMonthlyExpensesKeysEdited(e) {
  maybeEstimatedKeysEdited(
    e,
    isEstimatedExpensesKeys,
    MONTHLY__ESTIMATED_EXPENSES_VALUES_FROM_KEYS_OFFSET,
    MY_EXPENSE_CATEGORIES_LIST,
    true, // 'is planned' column in included
    MONTHLY__ESTIMATED_IS_PLANNED_FROM_EXPENSES_KEYS_OFFSET
  )
}

function maybeEstimatedMonthlyExpensesValuesEdited(e) {
  maybeEstimatedValuesEdited(
    e,
    isEstimatedExpensesValues,
    -MONTHLY__ESTIMATED_EXPENSES_VALUES_FROM_KEYS_OFFSET,
    MY_EXPENSE_CATEGORIES_LIST,
    true, // 'is planned' column in included
    MONTHLY__ESTIMATED_IS_PLANNED_FROM_EXPENSES_VALUES_OFFSET
  )
}


// ======================================== PRIVATE ========================================
/**
 * Keys (aka income or expense categories) editing 
 */
function maybeEstimatedKeysEdited(
  e,
  columnChecker: (range: GoogleAppsScript.Spreadsheet.Range) => boolean,
  valuesFromKeysOffset: number,
  selectableValuesList: any[],
  shouldProcessIsPlannedColumn: boolean,
  isPlannedColumnOffsetFromKeysColumn: number
) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!columnChecker(rangeEdited)) {
    return
  }

  const newKey = rangeEdited.getValue()

  var rowOffset = 0
  var columnOffset = valuesFromKeysOffset
  // same row, next column
  const valueSingleCellRange = getSingleCellRange(rangeEdited, rowOffset, columnOffset) // income/expense amounts for corresponding income/expense categories
  const currentValue = valueSingleCellRange.getDisplayValue()

  makeSelectable(rangeEdited, selectableValuesList)

  if (isEmpty(newKey)) {
    if (isEmpty(currentValue)) {
      // both key and value cell are empty -> remove coloring
      markAsManuallyHandled(rangeEdited)
      markAsManuallyHandled(valueSingleCellRange)

      totalClear(rangeEdited)

      if (shouldProcessIsPlannedColumn) {
        totalClear(getSingleCellRange(rangeEdited, rowOffset, isPlannedColumnOffsetFromKeysColumn))
      }
      return
    }
    else {
      markAsWarning(rangeEdited)
      
      if (shouldProcessIsPlannedColumn) {
        makeCheckable(rangeEdited, isPlannedColumnOffsetFromKeysColumn)
      }
    }
  }
  else {
    markAsManuallyHandled(rangeEdited)
    
    if (shouldProcessIsPlannedColumn) {
      makeCheckable(rangeEdited, isPlannedColumnOffsetFromKeysColumn)
    }

    if (isEmpty(currentValue)) {
      markAsWarning(valueSingleCellRange)
    } 
  }
}

/**
 * Amount values editing
 */
function maybeEstimatedValuesEdited(
  e,
  columnChecker: (range: GoogleAppsScript.Spreadsheet.Range) => boolean,
  keysFromValuesOffset: number,
  selectableValuesList: any[],
  shouldProcessIsPlannedColumn: boolean,
  isPlannedColumnOffsetFromValuesColumn: number
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
  var columnOffset = keysFromValuesOffset
  // same row, previous column
  const keySingleCellRange = getSingleCellRange(rangeEdited, rowOffset, columnOffset) // income/expense categories (aka keys)
  const currentKey = keySingleCellRange.getDisplayValue()

  makeSelectable(keySingleCellRange, selectableValuesList)

  // isNumeric returns false for empty string, so we need to check 
  // that string is not empty first in order to track true non-numeric values
  if (!isEmpty(newValue) && !isNumericString(newValue)) {
    markAsWarning(rangeEdited)
    return
  }

  if (isEmpty(newValue)) {
    if (isEmpty(currentKey)) {
      // both key and value cell are empty -> remove coloring
      markAsManuallyHandled(rangeEdited)
      markAsManuallyHandled(keySingleCellRange)

      totalClear(keySingleCellRange)
      
      if (shouldProcessIsPlannedColumn) {
        totalClear(getSingleCellRange(rangeEdited, rowOffset, isPlannedColumnOffsetFromValuesColumn))
      }
      return
    }
    else {
      markAsWarning(rangeEdited)
      
      if (shouldProcessIsPlannedColumn) {
        makeCheckable(rangeEdited, isPlannedColumnOffsetFromValuesColumn)
      }
    }
  }
  else {
    markAsManuallyHandled(rangeEdited)
   
    if (shouldProcessIsPlannedColumn) {
      makeCheckable(rangeEdited, isPlannedColumnOffsetFromValuesColumn)
    }

    if (isEmpty(currentKey)) {
      markAsWarning(keySingleCellRange)
    } 
  }
}

function isEstimatedIncomesKeys(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithSingleLetterAndIsInRowBounds(
    rangeEdited,
    MONTHLY__ESTIMATED_INCOMES_CATEGORY_LETTER,
    MONTHLY__KEYS_ROWS_LOWER_LIMIT,
    MONTHLY__KEYS_ROWS_UPPER_LIMIT
  )
}

function isEstimatedIncomesValues(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithSingleLetterAndIsInRowBounds(
    rangeEdited,
    MONTHLY__ESTIMATED_INCOMES_AMOUNT_LETTER,
    MONTHLY__KEYS_ROWS_LOWER_LIMIT,
    MONTHLY__KEYS_ROWS_UPPER_LIMIT
  )
}

function isEstimatedExpensesKeys(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithSingleLetterAndIsInRowBounds(
    rangeEdited,
    MONTHLY__ESTIMATED_EXPENSES_CATEGORY_LETTER,
    MONTHLY__KEYS_ROWS_LOWER_LIMIT,
    MONTHLY__KEYS_ROWS_UPPER_LIMIT
  )
}

function isEstimatedExpensesValues(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithSingleLetterAndIsInRowBounds(
    rangeEdited,
    MONTHLY__ESTIMATED_EXPENSES_AMOUNT_LETTER,
    MONTHLY__KEYS_ROWS_LOWER_LIMIT,
    MONTHLY__KEYS_ROWS_UPPER_LIMIT
  )
}
