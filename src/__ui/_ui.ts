function prepareMenus() {
  const ui = SpreadsheetApp.getUi()

  ui.createMenu('Automation')
    .addItem('Prepare data', 'processTinkoffData')
    .addItem('Compute statistics', 'processDailyAndMonthlyStatistics')
    .addSubMenu(
      ui.createMenu('Clear (debug)')
        .addItem('Clear Data', 'clearTinkoffAndOtherData')
        .addItem('Clear Days/Months', 'clearOldDailyAndMonthlyStatistics')
    )
    .addToUi();
}
