function processTinkoffData() {
  prepareOperationTypesAndMyCategoriesUsingTinkoffData()

  formatAllValues()
}

function processDailyAndMonthlyStatistics() {
  // scan if there are red cells in 'operation type' and 'my category' ranges (tinkoff and other)
  checkForUnfilledCellsInData()

  clearOldDailyAndMonthlyStatistics()

  const mergedUniversalDataEntries = mergeAndSortByDateTinkoffAndOtherDataEntries()
  const datesToUniversalDataEntries = mapByDate(mergedUniversalDataEntries)

  computeDailyStatistics(datesToUniversalDataEntries)

  computeMonthlyStatistics(mergedUniversalDataEntries)

  compareEstimatedAndActualExpensesAux()

  formatAllValues()
}

function sortSelectedEstimationRecords() {
  sortSelectedEstimationRecords0()
}
