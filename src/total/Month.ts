function computeMonthlyStatistics(universalDataEntries: UniversalDataEntry[]) {
  computeActualMonthlyStatistics(universalDataEntries, MONTHLY__ACTUAL_INCOMES_RANGE_TEXT, OperationType.INCOME)
  computeActualMonthlyStatistics(universalDataEntries, MONTHLY__ACTUAL_EXPENSES_RANGE_TEXT, OperationType.EXPENSE)
}

/**
 * @param fullRangeToWriteResultText e.g. ACTUAL_MONTHLY_INCOMES_RANGE_TEXT 
 * which is usually larger than actual range with a smaller number of records 'my category' -> total amount
 */
function computeActualMonthlyStatistics(
  universalDataEntries: UniversalDataEntry[],
  fullRangeToWriteResultText: string,
  operationType: OperationType
) {
  const myCategoriesToAmounts = new Map<string, number>();

  universalDataEntries.forEach(e => {
    if (e.operationType === operationType) {
      const category = e.myCategory
      const amount = e.amount

      setValueOrAddValueIfKeyExists(myCategoriesToAmounts, category, amount)
    }

    // account compensations only for expenses
    if (operationType === OperationType.EXPENSE && isCompensation(e.operationType)) {
      const category = e.myCategory
      const compensation = e.amount
     
      setValueOrAddValueIfKeyExists(myCategoriesToAmounts, category, -compensation)
    }
  })

  // what if e.g. no income have been found yet? 
  if (myCategoriesToAmounts.size === 0) {
    return
  }

  var resultArray: any[] = [];
  // note the 'forEach' signature (value goes first)
  myCategoriesToAmounts.forEach((value, key) => { resultArray.push([key, value]) })

  // resultArray contains 2-element arrays kind of: ['ALM',	10000]
  // we need to sort them in descending order by amount; empty arrays (['', '']) are considered as well
  resultArray.sort(monthlyStatisticsComparator)

  const rangeToWriteResult = getRange(fullRangeToWriteResultText)
  totalClear(rangeToWriteResult)

  // a new smaller subrange for values only without empty rows
  const newRange = getActiveSheet().getRange(
    rangeToWriteResult.getRow(),
    rangeToWriteResult.getColumn(),
    myCategoriesToAmounts.size,
    rangeToWriteResult.getNumColumns()
  )

  setValuesAndMarkAsProcessed(newRange, resultArray)
}

/**
 * This is a CRUTCH. Because it's impossible to create a bar diagram comparing values 
 * from different ranges with different X-axises (with same values sometimes)
 * 
 * Here I have to create a small table with one X-axis with united values (from estimated and actual ones)
 * 
 * Also I have to set background and font colors to GENERAL_BACKGROUND_COLOR
 */
function compareEstimatedAndActualMonthlyExpensesAux() {
  function fillMap(displayValues: string[][]): Map<string, number> {
    const categoriesToAmounts = new Map<string, number>()
  
    for (const rowInd in displayValues) {
      const rowValues = displayValues[rowInd]
      const category = rowValues[0]
      const amount = asNumber(rowValues[1])

      if (isEmpty(category)) {
        continue
      }
  
      // there might entries in estimated expenses with repeated keys (e.g. Музыка: 8800, Музыка: 10000)
      // it's easier to read them 
      const maybeTotalAmount = categoriesToAmounts.get(category)
      if (!maybeTotalAmount) {
        categoriesToAmounts.set(category, amount)
      } else {
        categoriesToAmounts.set(category, maybeTotalAmount + amount)
      }
    }

    return categoriesToAmounts
  }

  const estimatedExpensesDisplayValues = getRange(
    MONTHLY__ESTIMATED_EXPENSES_CATEGORY_LETTER + MONTHLY__KEYS_ROWS_LOWER_LIMIT.toString() + 
    ":" + 
    MONTHLY__ESTIMATED_EXPENSES_AMOUNT_LETTER + MONTHLY__KEYS_ROWS_UPPER_LIMIT.toString()
  ).getDisplayValues()

  const actualExpensesDisplayValues = getRange(
    MONTHLY__ACTUAL_EXPENSES_KEYS_LETTER + MONTHLY__KEYS_ROWS_LOWER_LIMIT.toString() + 
    ":" + 
    MONTHLY__ACTUAL_EXPENSES_VALUES_LETTER + MONTHLY__KEYS_ROWS_UPPER_LIMIT.toString()
  ).getDisplayValues()

  const estimatedExpensesToAmounts = fillMap(estimatedExpensesDisplayValues)
  const actualExpensesToAmounts = fillMap(actualExpensesDisplayValues)

  // values: two-elements arrays (1st el: estimated amount, 2nd el: actual amount)
  const resultMap: Map<string, number[]> = new Map<string, number[]>()

  estimatedExpensesToAmounts.forEach((estimatedValue, key) => {
    resultMap.set(key, [estimatedValue, 0])
  })

  actualExpensesToAmounts.forEach((actualValue, key) => {
    const maybeEstimatedAndActualValuesArray = resultMap.get(key) 

    if (!maybeEstimatedAndActualValuesArray) {
      resultMap.set(key, [0, actualValue])
    } else {
      // in general it's supposed that this array has 1st element set, 2nd element is zero
      maybeEstimatedAndActualValuesArray[1] += actualValue
      resultMap.set(key, maybeEstimatedAndActualValuesArray)
    }
  })

  const resultArray: any[][] = [] // each element is 3-elements array: category, estimated, actual

  resultMap.forEach((valuesArray, category) => {
    resultArray.push([category, ...valuesArray])
  })

  resultArray.sort(monthlyStatisticsComparator)

  const rangeToWriteResult = getRange(
    MONTHLY__AUX_RANGE_START_LETTER + MONTHLY__AUX_DATA_ROW_OFFSET.toString() + 
    ":" + 
    MONTHLY__AUX_RANGE_END_LETTER + (resultArray.length + MONTHLY__AUX_DATA_ROW_OFFSET - 1).toString()
  )
  rangeToWriteResult.setValues(resultArray)

  // hide values visiually
  const allAuxRange = getRange(MONTHLY__AUX_RANGE_INCLUDING_HEADER_TEXT)
  allAuxRange.setBackground(GENERAL_BACKGROUND_COLOR)
  allAuxRange.setFontColor(GENERAL_BACKGROUND_COLOR)
}


// ======================================== PRIVATE ========================================

function setValueOrAddValueIfKeyExists(map: Map<string, number>, key: string, newValue: number) {
  const maybeCurrentValue = map.get(key)

  if (maybeCurrentValue) {
    map.set(key, maybeCurrentValue + newValue)
  } else {
    map.set(key, newValue)
  }
}

const monthlyStatisticsComparator = (e1: any[], e2: any[]) => {
  if (e1[0] === '') {
    return 1; // positive, because of descending
  }
  if (e2[0] === '') {
    return 1; // positive, because of descending
  }

  return e2[1] - e1[1]; // descending
}

class ExpenseStatisticsEntry {
  myCategory: MyExpenseCategory
  amount: number

  constructor(rowDisplayValues: any[]) {
    this.myCategory = rowDisplayValues[ExpenseStatisticsEntry.MY_EXPENSE_CATEGORY_POS]
    this.amount = rowDisplayValues[ExpenseStatisticsEntry.AMOUNT_POS]
  }

  static MY_EXPENSE_CATEGORY_POS = 0
  static AMOUNT_POS = 1
}