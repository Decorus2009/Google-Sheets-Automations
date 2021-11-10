function sortEstimationRecords() {
  sortEstimationIncomesRecords()
  sortEstimationExpensesRecords()

  // const selectedRanges = getActiveSheet().getSelection().getActiveRangeList().getRanges()

  // selectedRanges.forEach(range => {
  //   const isEstimatedIncomesSubrange = isFullWidthSubrange(range, MONTHLY__ESTIMATED_INCOMES_RANGE_TEXT)
  //   const isEstimatedExpensesSubrange = isFullWidthSubrange(range, MONTHLY__ESTIMATED_EXPENSES_RANGE_TEXT)

  //   if (isEstimatedIncomesSubrange) {
  //     range.sort({ column: range.getColumn() + MONTHLY__ESTIMATED_INCOMES_AMOUNT_POS, ascending: false })
  //   }

  //   if (isEstimatedExpensesSubrange) {
  //     range.sort({ column: range.getColumn() + MONTHLY__ESTIMATED_EXPRENSES_AMOUNT_POS, ascending: false })
  //   }
  // })
}

function sortEstimationIncomesRecords() {
  const estimationIncomesRange = getRange(MONTHLY__ESTIMATED_INCOMES_RANGE_TEXT)
  estimationIncomesRange
    .sort({ column: estimationIncomesRange.getColumn() + MONTHLY__ESTIMATED_INCOMES_AMOUNT_POS, ascending: false })
}

function sortEstimationExpensesRecords() {
  const estimatedExpensesRange = getRange(MONTHLY__ESTIMATED_EXPENSES_RANGE_TEXT)
  const estimatedExpensesValues = estimatedExpensesRange.getDisplayValues()

  const sortedEstimatedExpensesValues = estimatedExpensesValues
    .filter((row: string[]) => {
      return row.some((value: string) => { return !isEmpty(value) })
    })
    .sort(estimationExpensesComparator)

  const startRow = MONTHLY_OPERATION_TYPE_ROWS_LOWER_LIMIT
  const endRow = MONTHLY_OPERATION_TYPE_ROWS_LOWER_LIMIT + sortedEstimatedExpensesValues.length - 1
  const rangeToWriteResult = getRange(
    MONTHLY__ESTIMATED_EXPENSES_START_LETTER + startRow.toString() + ":" +
    MONTHLY__ESTIMATED_EXPENSES_END_LETTER + endRow.toString()
  )

  totalClear(estimatedExpensesRange)
  rangeToWriteResult.setValues(sortedEstimatedExpensesValues)

  const isGuranteedColumnRange = getRange(
    MONTHLY__ESTIMATED_EXPENSES_START_LETTER + startRow.toString() + ":" +
    MONTHLY__ESTIMATED_EXPENSES_START_LETTER + endRow.toString()
  )

  const myCategoryOffsetFromIsGuranteed = 1
  const commentOffsetFromIsGuranteed = 3

  const myCategoryColumnRange = getSingleColumnRangeAfter(isGuranteedColumnRange, myCategoryOffsetFromIsGuranteed)
  const commentColumnRange = getSingleColumnRangeAfter(isGuranteedColumnRange, commentOffsetFromIsGuranteed)

  isGuranteedColumnRange.insertCheckboxes()
  makeSelectable(myCategoryColumnRange, MY_EXPENSE_CATEGORIES_LIST)
  commentColumnRange
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("right")
}



// ======================================== PRIVATE ========================================

/**
 * A composite comparator: 
 * 1. compare by 'is guarateed' check box value
 * 2. compare by amount DESC 
 */
const estimationExpensesComparator = (row1: string[], row2: string[]) => {
  const isGuranteed1 = asBoolean(row1[0])
  const isGuranteed2 = asBoolean(row2[0])

  if (isGuranteed1 === true && isGuranteed2 === false) {
    return -1
  }
  if (isGuranteed1 === false && isGuranteed2 === true) {
    return 1
  }
  else {
    return amountBasedComparator(row1, row2)
  }
}

const amountBasedComparator = (row1: string[], row2: string[]) => {
  return asNumber(row2[2]) - asNumber(row1[2])
}