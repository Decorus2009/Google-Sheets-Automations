// function computeDailyAndMonthlyStatistics() {
//   // scan if there are red cells in 'operation type' and 'my category' ranges (tinkoff and other)
//   checkForUnfilledCellsInData()

//   clearOldDailyAndMonthlyStatistics()

//   const mergedUniversalDataEntries = mergeAndSortByDate()
//   const datesToUniversalDataEntries = mapByDate(mergedUniversalDataEntries)

//   computeDailyStatistics(datesToUniversalDataEntries)

//   computeActualMonthlyStatistics(mergedUniversalDataEntries, MONTHLY__ACTUAL_INCOMES_RANGE_TEXT, OperationType.INCOME)
//   computeActualMonthlyStatistics(mergedUniversalDataEntries, MONTHLY__ACTUAL_EXPENSES_RANGE_TEXT, OperationType.EXPENSE)
  
//   // TODO fix column and row widths
//   formatAllValues()
// }

/**
 * Checks whether there're cells in 'operation type' and 'my category' ranges (for both Tinkoff and other data)
 * marked as red, i.e. cell that should be manually filled. 
 * 
 * If such a cell is found, throws an error
 */
function checkForUnfilledCellsInData() {
  const operationTypeAndMyCategoryTinkoffRange = getRange(TINKOFF__OPERATION_TYPE_AND_MY_CATEGORY_RANGE_TEXT)
  const operationTypeAndMyCategoryOtherRange = getRange(OTHER__OPERATION_TYPE_AND_MY_CATEGORY_RANGE_TEXT)

  const tinkoffBackgrounds = operationTypeAndMyCategoryTinkoffRange.getBackgrounds()
  const otherBackgrounds = operationTypeAndMyCategoryOtherRange.getBackgrounds()

  function checkBackgrounds(backgroundsColorCodesTable: string[][]) {
    backgroundsColorCodesTable.forEach(backgroundsColorCodesRow => {

      if (backgroundsColorCodesRow.find(it => { return it === MISSING_OR_WARNING_VALUE_CELL_BACKGROUND_COLOR })) {
        throw Error("UNFILLED CELLS FOUND")
      }
    })
  }

  checkBackgrounds(tinkoffBackgrounds)
  checkBackgrounds(otherBackgrounds)
}

function mergeAndSortByDateTinkoffAndOtherDataEntries(): UniversalDataEntry[] {
  // filtered ranges arrn't used because we don't write to these ranges here, only read corresponding display values 
  const filteredTinkoffDisplayValuesAndDataRange = getFilteredDisplayValuesAndRange(TINKOFF__DATA_RANGE_TEXT, tinkoffDataRowPredicateWithRemoval(false))
  const filteredOtherDisplayValuesAndDataRange = getFilteredDisplayValuesAndRange(OTHER__DATA_RANGE_TEXT, otherDataRowPredicate)

  const filteredTinkoffDisplayValues = filteredTinkoffDisplayValuesAndDataRange[0]
  const filteredOtherDisplayValues = filteredOtherDisplayValuesAndDataRange[0]

  const entriesTinkoff = filteredTinkoffDisplayValues.map((row: string[]) => {
    return new UniversalDataEntry(row, TINKOFF_DATA_TYPE)
  })
  const entriesOther = filteredOtherDisplayValues.map((row: any[]) => {
    return new UniversalDataEntry(row, OTHER_DATA_TYPE)
  })

  const allEntries = entriesTinkoff.concat(entriesOther)

  return allEntries.sort(universalDataEntryComparator)
}

function mapByDate(entriesSortedByDate: UniversalDataEntry[]): Map<string, UniversalDataEntry[]> {
  const datesToEntries = new Map<string, UniversalDataEntry[]>()

  entriesSortedByDate.forEach(e => {
    const date = e.date

    const maybeEntriesArray = datesToEntries.get(date)
    if (maybeEntriesArray) {
      maybeEntriesArray.push(e) // append an element to the end of the array
    }
    else {
      datesToEntries.set(date, [e]) // add a new map entry with a single-element array as a value
    }
  })

  return datesToEntries
}

const otherDataRowPredicate = (row: any[]) => {
  if (row.every(el => isEmpty(el))) {
    return false
  }

  return true
}