function prepareMenus() {
  const ui = SpreadsheetApp.getUi()

  ui.createMenu('Automation')
    .addItem('Prepare records', 'processTinkoffData')
    .addItem('Compute statistics', 'processDailyAndMonthlyStatistics')
    .addItem('Sort selected estimation records', 'sortSelectedEstimationRecords')
    .addSubMenu(
      ui.createMenu('Debug')
        .addItem('Clear records', 'clearTinkoffAndOtherData')
        .addItem('Clear statistics', 'clearOldDailyAndMonthlyStatistics')
    )
    .addToUi();
}
