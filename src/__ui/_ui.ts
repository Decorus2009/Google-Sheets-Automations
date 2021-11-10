function prepareMenus() {
  const ui = SpreadsheetApp.getUi()

  ui.createMenu('Automation')
    .addItem('Refresh', 'refresh')
    .addItem('Sort estimations', 'sortEstimationRecords')
    .addSubMenu(
      ui.createMenu('Debug')
        .addItem('Prepare records', 'processTinkoffData')
        .addItem('Compute statistics', 'processDailyAndMonthlyStatistics')
        .addItem('Clear records', 'clearTinkoffAndOtherData')
        .addItem('Clear statistics', 'clearOldDailyAndMonthlyStatistics')
    )
    .addToUi();
}
