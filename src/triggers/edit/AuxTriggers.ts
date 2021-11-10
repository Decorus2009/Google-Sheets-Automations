function maybeEstimatedSavingsPercentEdited(e) {
  const rangeEdited: GoogleAppsScript.Spreadsheet.Range = e.range

  if (!isSingleCellRange(rangeEdited)) {
    return
  }

  if (!isEstimatedSavingsPercent(rangeEdited)) {
    return
  }

  processDailyStatistics()
}
 

// ======================================== PRIVATE ========================================

function isEstimatedSavingsPercent(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, AUX_SAVINGS_RANGE_END_LETTER, AUX_SAVINGS_RANGE_START_ROW, AUX_SAVINGS_RANGE_START_ROW)
}

function isDailyBudgetValue(rangeEdited: GoogleAppsScript.Spreadsheet.Range): boolean {
  return startsWithAndIsInRowBounds(rangeEdited, AUX_SAVINGS_RANGE_START_LETTER, AUX_DAILY_BUDGET_ROW, AUX_DAILY_BUDGET_ROW)
}