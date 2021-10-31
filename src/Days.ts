function computeDailyStatistics(datesToUniversalDataEntries: Map<string, UniversalDataEntry[]>) {
  dailyStatistics(DAILY__DATE_RANGE_TEXT, datesToUniversalDataEntries, OperationType.EXPENSE, true) // include planned
  dailyStatistics(DAILY__DATE_RANGE_TEXT, datesToUniversalDataEntries, OperationType.EXPENSE, false) // DO NOT include planned

  dailyStatistics(DAILY__DATE_RANGE_TEXT, datesToUniversalDataEntries, OperationType.INCOME, true) // includePlannedCondition === true (by default, shouldn't influence as it's an INCOME)
  dailyStatistics(DAILY__DATE_RANGE_TEXT, datesToUniversalDataEntries, OperationType.TRANSFER, true) // includePlannedCondition === true (by default, shouldn't influence as it's a TRANSFER)

  dailyBudgetAndBalance(
    DAILY__DATE_RANGE_TEXT,
    DAILY__EXPENSE_EXCLUDING_PLANNED_RANGE_TEXT,
    DEFAULT_DAILY_BUDGET_CELL_TEXT,
    DAILY__BUDGET_AND_BALANCE_RANGE_TEXT,
  )
}

function dailyStatistics(
  datesRangeText: string, 
  datesToUniversalDataEntries: Map<string, UniversalDataEntry[]>, 
  operationType: string,
  includePlannedCondition: boolean
) {
  // NB: date cell is interpreted in the format: e.g.: Thu Jun 25 2020 01:00:00 GMT+0300 (Moscow Standard Time)
  // whereas they are displayed as 25.06.2020
  const datesSingleColumnRange = getRange(datesRangeText)
  const dateValues = datesSingleColumnRange.getDisplayValues()
  const datesToAmounts = new Map<string, number | string>()

  dateValues.forEach(singleElementDateArray => {
    const date = singleElementDateArray[0] // date is a single column -> values are single-elemnt array

    const maybeEntries = datesToUniversalDataEntries.get(date)
    if (!maybeEntries) {
      datesToAmounts.set(date, '')
      return // return@forEach
    }

    const amounts: number[] = maybeEntries
      .filter(e => { return e.operationType === operationType })
      .filter(e => { 
        if (includePlannedCondition) {
          // leave all the entries (both planned and not planned)
          return true
        }
        // else leave only NOT planned
        return e.isPlanned === false
      })
      .map(e => { return e.amount })

    // a date might be missing in Tinkoff and other data 
    // (e.g. middle of a month, but the outer iteration is by all month dates)
    if (amounts.length === 0) {
      return // return@forEach
    }

    var totalAmount = amounts.reduce((acc, nextAmount) => acc + nextAmount)

    // expenses should be decreased by the value of all compensations for a given date
    if (operationType === OperationType.EXPENSE) {
      const totalCompensations = getAllCompesationsAmount(maybeEntries)
      totalAmount -= totalCompensations
    }

    var valueForDate = undefined
    if (totalAmount === 0) valueForDate = ""
    else valueForDate = totalAmount

    datesToAmounts.set(date, valueForDate)
  })

  // define offset to write a proper value of expense (including or excluding planned) or income or trasfer to a single-cell range
  var columnOffset = undefined
  if (operationType === OperationType.EXPENSE) {
    if (includePlannedCondition) {
      columnOffset = DAILY__EXPENSE_INCLUDING_PLANNED_OFFSET_FROM_DATE
    }
    else {
      columnOffset = DAILY__EXPENSE_EXCLUDING_PLANNED_OFFSET_FROM_DATE
    }
  }
  if (operationType === OperationType.INCOME) columnOffset = DAILY__INCOME_OFFSET_FROM_DATE
  if (operationType === OperationType.TRANSFER) columnOffset = DAILY__TRANSFER_OFFSET_FROM_DATE

  for (const rowInd in dateValues) {
    const date = dateValues[rowInd][0]
    // range for EXPENSE_INCLUDING_PLANNED, EXPENSE_EXCLUDING_PLANNED, INCOME or TRANSFER
    const neighborCellRange = getSingleCellRange(datesSingleColumnRange, asNumber(rowInd), columnOffset)
    const valueForDate = datesToAmounts.get(date) // a number or ''

    if (valueForDate) {
      setValueAndMarkAsProcessed(neighborCellRange, valueForDate)
    }
  }
}

// TODO refactor later
/**
 * @param rangeToWriteResultText represents 2 columns: dailyBudget, dailyBalance
 */
function dailyBudgetAndBalance(
  datesRangeText: string,
  dailyExpenseExcludingPlannedRangeText: string,
  defaultDailyBudgetCellText: string,
  rangeToWriteResultText: string,
) {
  const dateValues = getValues(datesRangeText) // single-column
  const expenseExcludingPlannedValues = getValues(dailyExpenseExcludingPlannedRangeText) // single-column (exprenses excluding planned ones)
  const defaultDailyBudget = getValues(defaultDailyBudgetCellText)[0][0] // single cell 

  const firstDayConsumption = expenseExcludingPlannedValues[0][0]
  const initialDailyBalance = defaultDailyBudget - firstDayConsumption

  const resultArray = [];
  resultArray.push([defaultDailyBudget, initialDailyBalance])

  var prevDayBudgetAndBalance = resultArray[0]
  // 0 index-related value has been calculated above
  for (var ind = 1; ind < dateValues.length; ind++) {
    // if date cell is empty (month contains less than 30 days, e.g. June 2020)
    if (dateValues[ind][0] === '') {
      break;
    }

    const prevDayBalance = prevDayBudgetAndBalance[1]
    const curDayBudget = prevDayBalance + defaultDailyBudget
    const curDayExprense = expenseExcludingPlannedValues[ind][0]

    const curDayBalance = curDayBudget - curDayExprense

    resultArray.push([curDayBudget, curDayBalance])
    prevDayBudgetAndBalance = [curDayBudget, curDayBalance]
  }

  const rangeToWriteResult = getRange(rangeToWriteResultText)
  extendWithTwoElements(resultArray, rangeToWriteResult.getNumRows(), '', '')

  // no need to clear values, the whole range for budget and balance is recalculated 
  // otherwise even a simple [clear] call leads to a removal of coloring rules in the sheet
  rangeToWriteResult.setValues(resultArray)
  setAllowedOrWarningFormatting(rangeToWriteResult)

  /** 
   * Do not remove for now
   * NB: it DOES WORK SLOW, decided to add a rule for coloring right in the sheet (!!!)
   */

  // for (const rowInd in resultArray) {
  //   const budget = resultArray[rowInd][0]
  //   const balance = resultArray[rowInd][1]
  //   const numberRowInd = asNumber(rowInd)
  //   const curRowPosition = numberRowInd + 1 + numericValuesOffset // rowId is string somehow

  //   /* performance is the same as using getCell */
  //   // const budgetSingleCellRange = getActiveSheet().getRange(rangeToWriteResult.getRow() + numberRowInd, rangeToWriteResult.getColumn(), 1, 1)
  //   // const balanceSingleCellRange = getActiveSheet().getRange(rangeToWriteResult.getRow() + numberRowInd, rangeToWriteResult.getColumn(), 1, 2)
    
  //   // const budgetSingleCellRange = rangeToWriteResult.getCell(numberRowInd + 1, 1)
  //   // const balanceSingleCellRange = rangeToWriteResult.getCell(numberRowInd + 1, 2)

  //   const budgetAndBalanceSingleCellRanges = [
  //     rangeToWriteResult.getCell(numberRowInd + 1, 1),
  //     rangeToWriteResult.getCell(numberRowInd + 1, 2)
  //   ].forEach(singleCellRange => {
  //     if (asNumber(singleCellRange.getValue()) < 0) {
  //       markAsWarning(singleCellRange)
  //     }
  //   })

  //   // // set cell's font
  //   // if (budget > 0) {
  //   //   setFontColor(dailyBudgetRangeLetter + curRowPosition + ':' + dailyBudgetRangeLetter + curRowPosition, 'black')
  //   // }
  //   // // set cell's font
  //   // if (balance > 0) {
  //   //   setFontColor(dailyBalanceRangeLetter + curRowPosition + ':' + dailyBalanceRangeLetter + curRowPosition, 'red')
  //   // }
  // }
}



// ======================================== PRIVATE ========================================

/**
 * Computes the total amount of all compesations
 */
function getAllCompesationsAmount(entries: UniversalDataEntry[]): number {
  const compensationEntries = entries.filter(e => { return e.operationType === OperationType.COMPENSATION })

  if (compensationEntries.length === 0) {
    return 0
  }

  return compensationEntries
    .map(e => { return e.amount })
    .reduce((acc, nextAmount) => acc + nextAmount)
}