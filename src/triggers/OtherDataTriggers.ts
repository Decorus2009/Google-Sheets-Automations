// ---------------------------------- is planned ----------------------------------
function maybeOtherDataIsPlannedEdited(e) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!isOtherDataIsPlanned(rangeEdited)) {
    return
  }

  markOtherDataRowAsPlanned(rangeEdited)
}


// ---------------------------------- date ----------------------------------
/**
 * A user should start with editing date or amount column to make 'operation type' cell selectable and 'is planned' cell chackable
 */
 function maybeOtherDataDateEdited(e) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!isOtherDataDate(rangeEdited)) {
    return
  }

  markAsManuallyHandled(rangeEdited)

  const rowOffset = 0 // the same row
  const dateRangeInd = 0
  const amountRangeInd = 1
  const operationTypeRangeInd = 2
  const myCategoryRangeInd = 3
  const commentRangeInd = 4
  const allWritableSingleCellRanges = getOtherDataAllWritableSingleCellRanges(rangeEdited, rowOffset, OTHER__DATE_LETTER)

  const isPlannedSingleCellRange =     getSingleCellRange(rangeEdited, rowOffset, OTHER__IS_PLANNED_OFFSET_FROM_DATE)     // columnOffset = -1 (previous column)
  const dateSingleCellRange =          allWritableSingleCellRanges[dateRangeInd]
  const amountSingleCellRange =        allWritableSingleCellRanges[amountRangeInd]
  const operationTypeSingleCellRange = allWritableSingleCellRanges[operationTypeRangeInd]
  const myCategorySingleCellRange =    allWritableSingleCellRanges[myCategoryRangeInd]
  const commentSingleCellRange =       allWritableSingleCellRanges[commentRangeInd]

  const currentRow = rangeEdited.getRow()
  const dataRowRange = getOtherDataRowRange(currentRow)
      
  if (clearRowIfAllSingleCellRangesAreEmpty(allWritableSingleCellRanges, dataRowRange)) {
    // makeCheckable(isPlannedSingleCellRange, OTHER__IS_PLANNED_POS)
    // makeSelectable(operationTypeSingleCellRange, OPERATION_TYPES_LIST)
    return
  }


  makeCheckable(isPlannedSingleCellRange, OTHER__IS_PLANNED_POS)

  // mark as missing mandatory ranges only,
  // without my category, because it not always should have a value (e.g. for TRANSFER or COMPENSATION operation types)
  markAsMissingOrUnprocessedOtherDataEmptyRanges([
    dateSingleCellRange, 
    amountSingleCellRange, 
    operationTypeSingleCellRange, 
  ])

  makeSelectable(operationTypeSingleCellRange, OPERATION_TYPES_LIST)
}


// ---------------------------------- amount ----------------------------------
/**
 * A user should start with editing date or amount column to make 'operation type' cell selectable and 'is planned' cell chackable
 */
 function maybeOtherDataAmountEdited(e) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!isOtherDataAmount(rangeEdited)) {
    return
  }

  const outerCondition = true // nothing to check additionally

  markAsWarningIfNotNumericOrEmptySingleCell(rangeEdited, outerCondition)

  const rowOffset = 0 // the same row
  const dateRangeInd = 0
  const amountRangeInd = 1
  const operationTypeRangeInd = 2
  const myCategoryRangeInd = 3
  const commentRangeInd = 4
  
  const allWritableSingleCellRanges = getOtherDataAllWritableSingleCellRanges(rangeEdited, rowOffset, OTHER__AMOUNT_LETTER)

  const isPlannedSingleCellRange =     getSingleCellRange(rangeEdited, rowOffset, OTHER__IS_PLANNED_OFFSET_FROM_AMOUNT)
  const dateSingleCellRange =          allWritableSingleCellRanges[dateRangeInd]
  const amountSingleCellRange =        allWritableSingleCellRanges[amountRangeInd]
  const operationTypeSingleCellRange = allWritableSingleCellRanges[operationTypeRangeInd]
  const myCategorySingleCellRange =    allWritableSingleCellRanges[myCategoryRangeInd]
  const commentSingleCellRange =       allWritableSingleCellRanges[commentRangeInd]

  const currentRow = rangeEdited.getRow()
  const dataRowRange = getOtherDataRowRange(currentRow)

  if (clearRowIfAllSingleCellRangesAreEmpty(allWritableSingleCellRanges, dataRowRange)) {
    // makeCheckable(isPlannedSingleCellRange, OTHER__IS_PLANNED_POS)
    // makeSelectable(operationTypeSingleCellRange, OPERATION_TYPES_LIST)
    return
  }


  makeCheckable(isPlannedSingleCellRange, OTHER__IS_PLANNED_POS)

  // mark as missing mandatory ranges only,
  // without my category, because it not always should have a value (e.g. for TRANSFER or COMPENSATION operation types)
  markAsMissingOrUnprocessedOtherDataEmptyRanges([
    dateSingleCellRange,
    amountSingleCellRange, 
    operationTypeSingleCellRange, 
  ])

  makeSelectable(operationTypeSingleCellRange, OPERATION_TYPES_LIST)
}

// ---------------------------------- operation type ----------------------------------
function maybeOtherDataOperationTypeEdited(e) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range
  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!isOtherDataOperationType(rangeEdited)) {
    return
  }

  markAsManuallyHandled(rangeEdited)
  
  const rowOffset = 0 // the same row
  const dateRangeInd = 0
  const amountRangeInd = 1
  const operationTypeRangeInd = 2
  const myCategoryRangeInd = 3
  const commentRangeInd = 4
  
  const allWritableSingleCellRanges = getOtherDataAllWritableSingleCellRanges(rangeEdited, rowOffset, OTHER__OPERATION_TYPE_LETTER)

  const isPlannedSingleCellRange =     getSingleCellRange(rangeEdited, rowOffset, OTHER__IS_PLANNED_OFFSET_FROM_OPERATION_TYPE)
  const dateSingleCellRange =          allWritableSingleCellRanges[dateRangeInd]
  const amountSingleCellRange =        allWritableSingleCellRanges[amountRangeInd]
  const operationTypeSingleCellRange = allWritableSingleCellRanges[operationTypeRangeInd]
  const myCategorySingleCellRange =    allWritableSingleCellRanges[myCategoryRangeInd]
  const commentSingleCellRange =       allWritableSingleCellRanges[commentRangeInd]
  
  const currentRow = rangeEdited.getRow()
  const dataRowRange = getOtherDataRowRange(currentRow)
      
  if (clearRowIfAllSingleCellRangesAreEmpty(allWritableSingleCellRanges, dataRowRange)) {
    // makeCheckable(isPlannedSingleCellRange, OTHER__IS_PLANNED_POS)
    // makeSelectable(operationTypeSingleCellRange, OPERATION_TYPES_LIST)
    return
  }


  const currentValue = rangeEdited.getValue() // does not work via e.value

  if (isTransfer(currentValue)) {
    myCategorySingleCellRange.setValue('')
    myCategorySingleCellRange.setDataValidation(null)
    markAsManuallyHandled(myCategorySingleCellRange)
  }

  if (isIncomeOrExpenseOrCompensation(currentValue) && currentValue !== e.oldValue) {
    myCategorySingleCellRange.setValue('')
    markAsMissingOrUnprocessed(myCategorySingleCellRange)

    makeOtherDataMyCategoriesSelectableAccordingTo(rangeEdited, myCategorySingleCellRange)
  }

  makeCheckable(isPlannedSingleCellRange, OTHER__IS_PLANNED_POS)

  // mark as missing mandatory ranges only,
  // without my category, because it not always should have a value (e.g. for TRANSFER or COMPENSATION operation types)
  markAsMissingOrUnprocessedOtherDataEmptyRanges([
    dateSingleCellRange,
    amountSingleCellRange, 
    operationTypeSingleCellRange, 
  ])
}

// ---------------------------------- my category ----------------------------------
function maybeOtherDataMyCategoryEdited(e) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!isOtherDataMyCategory(rangeEdited)) {
    return
  }

  const rowOffset = 0 // the same row
  const dateRangeInd = 0
  const amountRangeInd = 1
  const operationTypeRangeInd = 2
  const myCategoryRangeInd = 3
  const commentRangeInd = 4
  
  const allWritableSingleCellRanges = getOtherDataAllWritableSingleCellRanges(rangeEdited, rowOffset, OTHER__MY_CATEGORY_LETTER)

  const isPlannedSingleCellRange =     getSingleCellRange(rangeEdited, rowOffset, OTHER__IS_PLANNED_OFFSET_FROM_MY_CATEGORY)
  const dateSingleCellRange =          allWritableSingleCellRanges[dateRangeInd]
  const amountSingleCellRange =        allWritableSingleCellRanges[amountRangeInd]
  const operationTypeSingleCellRange = allWritableSingleCellRanges[operationTypeRangeInd]
  const myCategorySingleCellRange =    allWritableSingleCellRanges[myCategoryRangeInd]
  const commentSingleCellRange =       allWritableSingleCellRanges[commentRangeInd]
  
  const currentRow = rangeEdited.getRow()
  const dataRowRange = getOtherDataRowRange(currentRow)
     
  if (clearRowIfAllSingleCellRangesAreEmpty(allWritableSingleCellRanges, dataRowRange)) {
    // makeCheckable(isPlannedSingleCellRange, OTHER__IS_PLANNED_POS)
    // makeSelectable(operationTypeSingleCellRange, OPERATION_TYPES_LIST)
    return
  }
  

  const currentValue = rangeEdited.getValue() // does not work via e.value
  const operationTypeValue = operationTypeSingleCellRange.getDisplayValue()

  if (isEmpty(currentValue) && isIncomeOrExpenseOrCompensation(operationTypeValue)) {
    markAsMissingOrUnprocessed(rangeEdited)
    return
  }

  markAsManuallyHandled(rangeEdited)

  // mark as missing mandatory ranges only,
  // without my category, because it not always should have a value (e.g. for TRANSFER or COMPENSATION operation types)
  markAsMissingOrUnprocessedOtherDataEmptyRanges([
    dateSingleCellRange,
    amountSingleCellRange, 
    operationTypeSingleCellRange, 
  ])
}

// ---------------------------------- comment ----------------------------------
function maybeOtherDataCommentEdited(e) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!isOtherDataComment(rangeEdited)) {
    return
  }

  const rowOffset = 0 // the same row
  const dateRangeInd = 0
  const amountRangeInd = 1
  const operationTypeRangeInd = 2
  const myCategoryRangeInd = 3
  const commentRangeInd = 4
  
  const allWritableSingleCellRanges = getOtherDataAllWritableSingleCellRanges(rangeEdited, rowOffset, OTHER__COMMENT_LETTER)

  const isPlannedSingleCellRange =     getSingleCellRange(rangeEdited, rowOffset, OTHER__IS_PLANNED_OFFSET_FROM_COMMENT)
  const dateSingleCellRange =          allWritableSingleCellRanges[dateRangeInd]
  const amountSingleCellRange =        allWritableSingleCellRanges[amountRangeInd]
  const operationTypeSingleCellRange = allWritableSingleCellRanges[operationTypeRangeInd]
  const myCategorySingleCellRange =    allWritableSingleCellRanges[myCategoryRangeInd]
  const commentSingleCellRange =       allWritableSingleCellRanges[commentRangeInd]
  
  const currentRow = rangeEdited.getRow()
  const dataRowRange = getOtherDataRowRange(currentRow)
     
  if (clearRowIfAllSingleCellRangesAreEmpty(allWritableSingleCellRanges, dataRowRange)) {
    // makeCheckable(isPlannedSingleCellRange, OTHER__IS_PLANNED_POS)
    // makeSelectable(operationTypeSingleCellRange, OPERATION_TYPES_LIST)
    return
  }

  // mark as missing mandatory ranges only,
  // without my category, because it not always should have a value (e.g. for TRANSFER or COMPENSATION operation types)
  markAsMissingOrUnprocessedOtherDataEmptyRanges([
    dateSingleCellRange,
    amountSingleCellRange, 
    operationTypeSingleCellRange, 
  ]) 
}

// ======================================== PRIVATE ========================================
function isOtherDataIsPlanned(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, OTHER__IS_PLANNED_LETTER, DATA_ROWS_LOWER_LIMIT, DATA_ROWS_UPPER_LIMIT)
}

function isOtherDataDate(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, OTHER__DATE_LETTER, DATA_ROWS_LOWER_LIMIT, DATA_ROWS_UPPER_LIMIT)
}

function isOtherDataAmount(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, OTHER__AMOUNT_LETTER, DATA_ROWS_LOWER_LIMIT, DATA_ROWS_UPPER_LIMIT)
}

function isOtherDataOperationType(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, OTHER__OPERATION_TYPE_LETTER, DATA_ROWS_LOWER_LIMIT, DATA_ROWS_UPPER_LIMIT)
}

function isOtherDataMyCategory(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, OTHER__MY_CATEGORY_LETTER, DATA_ROWS_LOWER_LIMIT, DATA_ROWS_UPPER_LIMIT)
}

function isOtherDataComment(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, OTHER__COMMENT_LETTER, DATA_ROWS_LOWER_LIMIT, DATA_ROWS_UPPER_LIMIT)
}
 

function makeOtherDataMyCategoriesSelectableAccordingTo(
  operationTypeSingleCellRange: GoogleAppsScript.Spreadsheet.Range,
  myCategorySingleCellRange: GoogleAppsScript.Spreadsheet.Range,
) {
  const operationTypeValue = operationTypeSingleCellRange.getDisplayValue()
  const myCategoryValue = myCategorySingleCellRange.getDisplayValue()

  makeMyCategoriesSelectableAccordingTo(operationTypeValue, myCategoryValue, operationTypeSingleCellRange, myCategorySingleCellRange)
}

function clearRowIfAllSingleCellRangesAreEmpty(
  ranges: GoogleAppsScript.Spreadsheet.Range[],
  dataRowRange: GoogleAppsScript.Spreadsheet.Range
): boolean {
  if (ranges.every((singleCellRange) => isEmpty(singleCellRange.getDisplayValue()))) {
    totalClear(dataRowRange)

    // totalClear above removes validation rules and text formatting (e.g. resets to Arial font).
    // Tt's necessary because we also remove select lists for 'operation type' and 'my category', 
    // the date column is also touched. We have to restore previous settings
    restoreFormattingAndDateValidationRuleForDataRow(ranges, dataRowRange)
    return true
  }

  return false
}

/**
 * @returns single-row range for all 'other' data values
 */
function getOtherDataRowRange(rowInd: number): GoogleAppsScript.Spreadsheet.Range {
  return getDataRowRange(rowInd, OTHER__FIRST_COLUMN_LETTER, OTHER__LAST_COLUMN_LETTER)
}

function getOtherDataAllWritableSingleCellRanges(rangeEdited: GoogleAppsScript.Spreadsheet.Range, rowOffset: number, columnLetter: string): GoogleAppsScript.Spreadsheet.Range[] {
  var offsets: number[]
  if (columnLetter === OTHER__DATE_LETTER) {
    offsets = getOffsetsFromDate()
  }
  else if (columnLetter === OTHER__AMOUNT_LETTER) {
    offsets = getOffsetsFromAmount()
  }
  else if (columnLetter === OTHER__OPERATION_TYPE_LETTER) {
    offsets = getOffsetsFromOperationType()
  }
  else if (columnLetter === OTHER__MY_CATEGORY_LETTER) {
    offsets = getOffsetsFromMyCategory()

  }
  else if (columnLetter === OTHER__COMMENT_LETTER) {
    offsets = getOffsetsFromComment()
  }
    
  const dateSingleCellRange =          getSingleCellRange(rangeEdited, rowOffset, offsets[1])
  const amountSingleCellRange =        getSingleCellRange(rangeEdited, rowOffset, offsets[2])
  const operationTypeSingleCellRange = getSingleCellRange(rangeEdited, rowOffset, offsets[3])
  const myCategorySingleCellRange =    getSingleCellRange(rangeEdited, rowOffset, offsets[4])
  const commentSingleCellRange =       getSingleCellRange(rangeEdited, rowOffset, offsets[5])

  return [
    dateSingleCellRange, 
    amountSingleCellRange, 
    operationTypeSingleCellRange, 
    myCategorySingleCellRange, 
    commentSingleCellRange
  ]
}

function markAsMissingOrUnprocessedOtherDataEmptyRanges(ranges: GoogleAppsScript.Spreadsheet.Range[]) {
  ranges.forEach(range => {
    if (isEmpty(range.getDisplayValue())) {
      markAsMissingOrUnprocessed(range)
    }
  })
}

/**
 * Doesn't touch 'operation type' and 'my category' columns (they are highlighted as processed separately)
 */
function markOtherDataRowAsPlanned(rangeEdited: GoogleAppsScript.Spreadsheet.Range) {
  const isPlanned = asBoolean(rangeEdited.getDisplayValue())
  markAsPlannedOrNot(
    getOtherDataRowRange(rangeEdited.getRow()), 
    isPlanned,
    OTHER__PLANNED_DATA_BACKGROUND_COLOR
  )
}

function restoreFormattingAndDateValidationRuleForDataRow(
  allWritableSingleCellRanges: GoogleAppsScript.Spreadsheet.Range[],
  dataRowRange: GoogleAppsScript.Spreadsheet.Range
) {
  const dateRangeInd = 0
  const dateRange = allWritableSingleCellRanges[dateRangeInd]
  requireDateValidationForRange(dateRange)

  formatValuesCells(dataRowRange)
}