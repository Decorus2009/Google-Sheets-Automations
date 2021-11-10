function refresh() {
  processTinkoffData()

  processDailyAndMonthlyStatistics()
}

function processTinkoffData() {
  prepareOperationTypesAndMyCategoriesUsingTinkoffData()

  formatAllValues()
}

function processDailyAndMonthlyStatistics() {
  // scan if there are red cells in 'operation type' and 'my category' ranges (tinkoff and other)
  checkForUnfilledCellsInData()

  clearOldDailyStatistics()
  clearOldMonthlyStatistics()

  const mergedUniversalDataEntries = mergeAndSortByDateTinkoffAndOtherDataEntries()
  const datesToUniversalDataEntries = mapByDate(mergedUniversalDataEntries)

  computeDailyStatistics(datesToUniversalDataEntries)

  computeMonthlyStatistics(mergedUniversalDataEntries)

  compareEstimatedAndActualMonthlyExpensesAux()

  formatAllValues()
}

/**
 * A lighter version of [processDailyAndMonthlyStatistics] triggered on editing of cells influencing 
 * daily statistics only
 * 
 * E.g. redefining daily budget value, no need to touch months
 */
 function processDailyStatistics() {
  // scan if there are red cells in 'operation type' and 'my category' ranges (tinkoff and other)
  checkForUnfilledCellsInData()

  clearOldDailyStatistics()

  const mergedUniversalDataEntries = mergeAndSortByDateTinkoffAndOtherDataEntries()
  const datesToUniversalDataEntries = mapByDate(mergedUniversalDataEntries)

  computeDailyStatistics(datesToUniversalDataEntries)

  formatAllValues()
}