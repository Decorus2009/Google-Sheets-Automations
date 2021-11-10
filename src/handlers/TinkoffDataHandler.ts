/**
 * Steps 1 - 6
 */
function prepareOperationTypesAndMyCategoriesUsingTinkoffData() {
  
  // formatTinkoffDataHeaders()

  sortRawTinkoffData(TINKOFF__DATA_RANGE_TEXT)

  const tinkoffDataFilteredRange = filterAndFillRange(TINKOFF__DATA_RANGE_TEXT, tinkoffDataRowPredicateWithRemoval(true))

  const operationTypesRange = defineAndFill(
    tinkoffDataFilteredRange,
    () => getTinkoffDataOperationTypeRange(tinkoffDataFilteredRange),
    (entry) => entry.operationType
  )

  const myCategoriesRange = defineAndFill(
    tinkoffDataFilteredRange,
    () => getTinkoffDataMyCategoryRange(tinkoffDataFilteredRange),
    (entry) => entry.myCategory
  )

  highlightManuallyEditedOperationTypesAndMyCategories(tinkoffDataFilteredRange)

  makeCheckable(tinkoffDataFilteredRange, TINKOFF__IS_PLANNED_POS)
  makeSelectable(operationTypesRange, OPERATION_TYPES_LIST)
  makeTinkoffDataMyCategoriesSelectableAccordingTo(operationTypesRange, myCategoriesRange)

  fixTinkoffNumberColums(tinkoffDataFilteredRange)

  highlightPlannedRows(tinkoffDataFilteredRange)
}


/** Step 1. Sort T data by date ASC
 * 
 * (initially T raw is sorted in DESC order by dates) */
function sortRawTinkoffData(tinkoffDataRangeText: string) {
  const range = getRange(tinkoffDataRangeText)
  // sort by 2nd column in range (i.e. date of operation). NB: using '1' doesn't work ('1' == col A)
  range.sort(range.getColumn() + TINKOFF__DATE_TIME_POS)
}


/**
 * Steps 3 and 4. Define operation types and my categories and fill adjacent columns
 *  
 * (fills a single-column range defined by the @param columnOffset with regard to @param tinkoffDataFilteredRange with values taken from [tinkoffEntryPropertyChooser].
 * Use-cases: operation type column and my category column)
 * @returns defined and filled range (e.g. range corresponding to operation type column or my category column)
 */
function defineAndFill(
  tinkoffDataFilteredRange: GoogleAppsScript.Spreadsheet.Range,
  rangeToWriteResultChooser: () => GoogleAppsScript.Spreadsheet.Range,
  tinkoffEntryPropertyChooser: (entry: TinkoffDataRowEntry) => string
): GoogleAppsScript.Spreadsheet.Range {
  const tinkoffDataFilteredValues = tinkoffDataFilteredRange.getDisplayValues()
  const resultArray: any[][] = []; // my categories | operation type

  for (const rowInd in tinkoffDataFilteredValues) {
    const rowDataValues = tinkoffDataFilteredValues[rowInd]

    const tinkoffEntry = new TinkoffDataRowEntry(rowDataValues)

    addElementAsArrayTo(resultArray, tinkoffEntryPropertyChooser(tinkoffEntry))
  }

  const rangeToWriteResult = rangeToWriteResultChooser()
  fillRange(rangeToWriteResult, resultArray)

  return rangeToWriteResult
}

/**
 * Step 5. Make cell values for operation type and my category column selectable for manual adjustmnents
 * @param myCategoriesRange is necessary to take values of its cell with no performance impact
 */
function makeTinkoffDataMyCategoriesSelectableAccordingTo(
  operationTypesRange: GoogleAppsScript.Spreadsheet.Range,
  myCategoriesRange: GoogleAppsScript.Spreadsheet.Range,
) {
  const operationTypeValues = operationTypesRange.getDisplayValues()
  const myCategoryValues = myCategoriesRange.getDisplayValues()

  for (const rowInd in operationTypeValues) {
    // we need to create a single-cell range at my category column at a given row 
    // in order to set proper validation rule on it depending on the operation type
    const startRowInd = operationTypesRange.getRow() + asNumber(rowInd) // current row in a sheet (rowInd seems to start with '0')
    const endColIndex = operationTypesRange.getColumn() // this column

    const operationTypeSingleCellRange = getActiveSheet().getRange(startRowInd, endColIndex, 1)
    const myCategorySingleCellRange = getActiveSheet().getRange(startRowInd, endColIndex + TINKOFF__MY_CATEGORIES_OFFSET_FROM_OPERATION_TYPE, 1)

    const operationTypeValue = operationTypeValues[rowInd][0]

    /**
     * NB: PERFORMANCE OPTIMIZATION: 
     * somehow simple code kind of
     *   if (isEmpty(myCategorySingleCellRange.getValue())) {
     *     myCategorySingleCellRange.setBackground(MISSING_MY_CATEGORY_VALUE_CELL_BACKGROUND_COLOR) 
     *   }
     *   
     *   or
     * 
     *   if (isEmpty(myCategorySingleCellRange.getValues()[0][0])) {
     *     myCategorySingleCellRange.setBackground(MISSING_MY_CATEGORY_VALUE_CELL_BACKGROUND_COLOR) 
     *   }
     * 
     * dramatically reduces performance ('my category' column cells are being processed as selectable one by one with rate ~3 cells/sec!)
     * 
     * The code below allows to make all these cells selectable at a time! 
     * As a crutch I have to pass @param myCategoriesRange from the outer scope in order to take a cell value 
     * in a similar way as I take value for each 'operation type' cell
     * (see the code above: 'const myCategory = myCategoryValues[rowInd][0]')
     * 
     * Note that I have to rely on the invariant that 'operation type' and 'my category' both represent single columns of the same size
     * 
     * All of that is because I need to highlight empty cells in 'my category' (see below)
     */
    const myCategoryValue = myCategoryValues[rowInd][0]

    makeMyCategoriesSelectableAccordingTo(operationTypeValue, myCategoryValue, operationTypeSingleCellRange, myCategorySingleCellRange)
  }
}

/**
 * Step 6. Other preparations
 */
function formatTinkoffDataHeaders() {
  TINKOFF_HEADERS_RANGE_TEXTS_LIST.forEach(headerRangeText => {
    const headerRange = getRange(headerRangeText)

    headerRange.mergeVertically()
    headerRange.setHorizontalAlignment("center")
    headerRange.setVerticalAlignment("middle")

    const style = SpreadsheetApp.newTextStyle()
      .setFontFamily(FONT)
      .setFontSize(12)
      .setBold(true)
      .build()
    headerRange.setTextStyle(style)

    // facility column, another coloring
    if (headerRangeText === TINKOFF__MANUAL_EDITING_INFO_HEADER_RANGE_TEXT) {
      headerRange.setBackground(TINKOFF__FACILITY_HEADER_BACKGROUND_COLOR)
      return // return@forEach
    }

    headerRange.setBackground(TINKOFF__HEADER_BACKGROUND_COLOR)

    // TINKOFF header
    if (headerRangeText == TINKOFF_HEADERS_RANGE_TEXTS_LIST[0]) {
      headerRange.setTextStyle(SpreadsheetApp.newTextStyle().setFontFamily("Arial").setFontSize(14).build()) // a separate font style for T logo
      return // return@forEach
    }
  });
}

/**
 * Step 6. Other preparations
 */
function fixTinkoffNumberColums(tinkoffDataFilteredRange: GoogleAppsScript.Spreadsheet.Range) {
  function getSingleColumnNumbersRange(columnOffset: number): GoogleAppsScript.Spreadsheet.Range {
    return getActiveSheet().getRange(
      tinkoffDataFilteredRange.getRow(),
      tinkoffDataFilteredRange.getColumn() + columnOffset,
      tinkoffDataFilteredRange.getNumRows(),
      1
    )
  }

  const operationAmountRange = getSingleColumnNumbersRange(TINKOFF__AMOUNT_POS) 
  const paymentAmountRange = getSingleColumnNumbersRange(TINKOFF__PAYMENT_AMOUNT_POS)
  const bonusesRange = getSingleColumnNumbersRange(TINKOFF__BONUSES_POS) 
  const invsestmentRoundingRange = getSingleColumnNumbersRange(TINKOFF__INVESTMENT_ROUNDING__POS) 
  const amountRoundedRange = getSingleColumnNumbersRange(TINKOFF__AMOUNT_ROUNDED_POS)
  const rangesArr = [operationAmountRange, paymentAmountRange, bonusesRange, invsestmentRoundingRange, amountRoundedRange]

  rangesArr.forEach(range => {
    const resultArray: number[][] = range.getValues().map(itArr => itArr.map(it => asNumber(it)))

    range.setValues(resultArray)
    range.setHorizontalAlignment("left")
  })
}

/**
 * Step 6. Other preparations
 * Invariant: operationTypeRange.length === myCategoryRange.length === manualEditingInfoRange.length
 */
function highlightManuallyEditedOperationTypesAndMyCategories(tinkoffDataFilteredRange: GoogleAppsScript.Spreadsheet.Range) {
  const operationTypeRange = getTinkoffDataOperationTypeRange(tinkoffDataFilteredRange)
  const myCategoryRange = getTinkoffDataMyCategoryRange(tinkoffDataFilteredRange)
  const manualEditingInfoValues = getTinkoffDataManualEditingInfoRange(tinkoffDataFilteredRange).getDisplayValues()

  // TODO replace with 'const rowInd in manualEditingInfoRange' ?
  for (const rowInd in manualEditingInfoValues) {
    const columnOffset = 0 // the same column
    const operationTypeCellRange = getSingleCellRange(operationTypeRange, asNumber(rowInd), columnOffset)
    const myCategoryCellRange = getSingleCellRange(myCategoryRange, asNumber(rowInd), columnOffset)      
    const manualEditingInfo = new ManualEditingInfo(manualEditingInfoValues[rowInd][0])

    if (manualEditingInfo.isOperationTypeEdited) {
      markAsManuallyHandled(operationTypeCellRange)
    }

    if (manualEditingInfo.isMyCategoryEdited) {
      markAsManuallyHandled(myCategoryCellRange)
    }
  }
}

/**
 * On recalculation planned rows coloring is somehow lost (we need to restore it)
 */
function highlightPlannedRows(tinkoffDataFilteredRange: GoogleAppsScript.Spreadsheet.Range) {
  const isPlannedSingleColumnRange = getTinkoffDataIsPlannedRange(tinkoffDataFilteredRange)
  const columnOffset = 0 // the same column

  for (var rowInd = 0; rowInd < isPlannedSingleColumnRange.getNumRows(); rowInd++) {
    const isPlannedSingleCellRange = getSingleCellRange(isPlannedSingleColumnRange, rowInd, columnOffset)

    if (asBoolean(isPlannedSingleCellRange.getDisplayValue())) {
      markTinkoffDataRowAsPlanned(isPlannedSingleCellRange)
    }
  }
}


// ======================================== PRIVATE ========================================

function tinkoffDataRowPredicateWithRemoval(considerRemovable: boolean): (row: any[]) => boolean {
  const tinkoffDataRowPredicate = (row: any[]) => {
    if (row.every(el => isEmpty(el))) {
      return false
    }

    // do not create a new TinkoffDataRowEntry if there's no purpose to remove rows:
    // e.g.: rows have already been removed earlier at the preparation stage. 
    // During merge we just combine filtered Tinkoff data with other data 
    if (considerRemovable) {
      const tinkoffEntry = new TinkoffDataRowEntry(row)
      if (tinkoffEntry.shouldBeRemoved()) {
        return false
      }
    }

    return true
  }

  return tinkoffDataRowPredicate
}


function getTinkoffDataIsPlannedRange(tinkoffDataFilteredRange: GoogleAppsScript.Spreadsheet.Range): GoogleAppsScript.Spreadsheet.Range {
  const columnBackOffset = TINKOFF__IS_PLANNED_COLUMN_BACK_OFFSET
  return getSingleColumnRangeFromEnd(tinkoffDataFilteredRange, columnBackOffset)
}

function getTinkoffDataOperationTypeRange(tinkoffDataFilteredRange: GoogleAppsScript.Spreadsheet.Range): GoogleAppsScript.Spreadsheet.Range {
  const columnBackOffset = TINKOFF__OPERATION_TYPE_COLUMN_BACK_OFFSET
  return getSingleColumnRangeFromEnd(tinkoffDataFilteredRange, columnBackOffset)
}

function getTinkoffDataMyCategoryRange(tinkoffDataFilteredRange: GoogleAppsScript.Spreadsheet.Range): GoogleAppsScript.Spreadsheet.Range {
  const columnBackOffset = TINKOFF__MY_CATEGORY_COLUMN_BACK_OFFSET
  return getSingleColumnRangeFromEnd(tinkoffDataFilteredRange, columnBackOffset)
}

function getTinkoffDataManualEditingInfoRange(tinkoffDataFilteredRange: GoogleAppsScript.Spreadsheet.Range): GoogleAppsScript.Spreadsheet.Range {
  const columnBackOffset = TINKOFF__MANUAL_EDITING_INFO_COLUMN_BACK_OFFSET // column before the last one
  return getSingleColumnRangeFromEnd(tinkoffDataFilteredRange, columnBackOffset)
}
