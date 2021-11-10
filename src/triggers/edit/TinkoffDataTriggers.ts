function maybeTinkoffDataIsPlannedEdited(e) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!isTinkoffDataIsPlanned(rangeEdited)) {
    return
  }

  const currentValue = rangeEdited.getValue() // does not work via e.value

  markAsManuallyHandled(rangeEdited)

  const manualEditingInfoRange = getSingleColumnRangeAfter(rangeEdited, TINKOFF__MANUAL_EDITING_INFO_OFFSET_FROM_IS_PLANNED)
  const manualEditingInfo = new ManualEditingInfo(manualEditingInfoRange.getDisplayValue())

  manualEditingInfo.markIsPlannedEdited()
  manualEditingInfoRange.setValue(manualEditingInfo.toString())

  markTinkoffDataRowAsPlanned(rangeEdited)
}

function maybeTinkoffDataOperationTypeEdited(e) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!isTinkoffDataOperationType(rangeEdited)) {
    return
  }

  const currentValue = rangeEdited.getValue() // does not work via e.value

  if (isEmpty(currentValue)) {
    markAsMissingOrUnprocessed(rangeEdited)
    return
  }

  markAsManuallyHandled(rangeEdited)

  // I have to define it here because of a performance optimization in [makeMyCategoriesSelectableAccordingTo]
  // (see the big comment there)
  const myCategoriesRange =      getSingleColumnRangeAfter(rangeEdited, TINKOFF__MY_CATEGORIES_OFFSET_FROM_OPERATION_TYPE)
  const manualEditingInfoRange = getSingleColumnRangeAfter(rangeEdited, TINKOFF__MY_CATEGORIES_OFFSET_FROM_OPERATION_TYPE + TINKOFF__MANUAL_EDITING_INFO_OFFSET_FROM_MY_CATEGORIES)
  const manualEditingInfo = new ManualEditingInfo(manualEditingInfoRange.getDisplayValue())

  manualEditingInfo.markOperationTypeEdited()
  manualEditingInfoRange.setValue(manualEditingInfo.toString())

  if (isTransfer(rangeEdited.getValue())) {
    myCategoriesRange.setValue('')
    // TODO remove with myCategoriesRange.clearDataValidations() ??
    myCategoriesRange.setDataValidation(null)
    markAsProcessed(myCategoriesRange)

    manualEditingInfo.markMyCategoryNotEdited()
    manualEditingInfoRange.setValue(manualEditingInfo.toString())

    return
  }

  if (isIncomeOrExpenseOrCompensation(currentValue) && currentValue !== e.oldValue) {
    // highlight cell with missing value for 'my category' for 'income operation' which is impossible to define 
    // (e.g. transfer by phone number for goods/food)
    myCategoriesRange.setValue('')
    markAsMissingOrUnprocessed(myCategoriesRange)

    manualEditingInfo.markMyCategoryNotEdited()
    manualEditingInfoRange.setValue(manualEditingInfo.toString())

    makeTinkoffDataMyCategoriesSelectableAccordingTo(rangeEdited, myCategoriesRange)
  }
}

function maybeTinkoffDataMyCategoryEdited(e) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!isTinkoffDataMyCategory(rangeEdited)) {
    return
  }

  const currentValue = rangeEdited.getValue() // does not work via e.value
  const rowOffset = 0 // the same row
  const operationType = getSingleCellRange(rangeEdited, rowOffset, -TINKOFF__MY_CATEGORIES_OFFSET_FROM_OPERATION_TYPE).getValue() // columnOffset = -1 (previous column)

  if (isEmpty(currentValue) && isIncomeOrExpenseOrCompensation(operationType)) {
    markAsMissingOrUnprocessed(rangeEdited)
    return
  }

  if (isEmpty(currentValue) && isTransfer(operationType)) {
    markAsProcessed(rangeEdited)
    return
  }

  markAsManuallyHandled(rangeEdited)

  const manualEditingInfoRange = getSingleColumnRangeAfter(rangeEdited, TINKOFF__MANUAL_EDITING_INFO_OFFSET_FROM_MY_CATEGORIES)
  const manualEditingInfo = new ManualEditingInfo(manualEditingInfoRange.getDisplayValue())

  manualEditingInfo.markMyCategoryEdited()
  manualEditingInfoRange.setValue(manualEditingInfo.toString())
}


// ======================================== PRIVATE ========================================

function isTinkoffDataIsPlanned(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, TINKOFF__IS_PLANNED_LETTER, DATA_ROWS_LOWER_LIMIT, DATA_ROWS_UPPER_LIMIT)
}

function isTinkoffDataOperationType(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, TINKOFF__OPERATION_TYPE_LETTER, DATA_ROWS_LOWER_LIMIT, DATA_ROWS_UPPER_LIMIT)
}

function isTinkoffDataMyCategory(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, TINKOFF__MY_CATEGORY_LETTER, DATA_ROWS_LOWER_LIMIT, DATA_ROWS_UPPER_LIMIT)
}

function isTinkoffDataManualEditingInfoChanged(rangeChanged: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeChanged, TINKOFF__MANUAL_EDITING_INFO_LETTER, DATA_ROWS_LOWER_LIMIT, DATA_ROWS_UPPER_LIMIT)
}

/**
 * @returns two single-row ranges: 
 *   first for columns before 'operation type' and 'my category'
 *   second for columns after 'operation type' and 'my category' (for now it's comment colmn only)
 */
function getTinkoffDataSingleRowRanges(rowInd: number): GoogleAppsScript.Spreadsheet.Range[] {
  return [
    getDataRowRange(rowInd, TINKOFF__FIRST_COLUMN_LETTER, TINKOFF__OPERATION_AMOUNT_WITH_ROUNDING_LETTER),
    getDataRowRange(rowInd, TINKOFF__COMMENT_LETTER, TINKOFF__LAST_COLUMN_LETTER),
  ]
}

/**
 * Doesn't touch 'operation type' and 'my category' columns (they are highlighted as processed separately)
 */
function markTinkoffDataRowAsPlanned(rangeEdited: GoogleAppsScript.Spreadsheet.Range) {
  const isPlanned = asBoolean(rangeEdited.getDisplayValue())
  getTinkoffDataSingleRowRanges(rangeEdited.getRow()).forEach(range => {
    markAsPlannedOrNot(
      range, 
      isPlanned,
      TINKOFF__PLANNED_DATA_BACKGROUND_COLOR
    )
  })
}