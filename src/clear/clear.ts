// TODO for tests and debugging
function clearTinkoffAndOtherData() {
  [
    TINKOFF__DATA_RANGE_TEXT,
    OTHER__DATA_RANGE_TEXT,
  ].map(rangeText => {
    const range = getRange(rangeText)

    range.clear()
    range.setDataValidation(null)
  })

  requireDateValidationForOtherDataDateColumn()
}

function clearOldDailyStatistics() {
  clearOldStatistics([
    getDailyRangeText(DAILY__EXPENSE_INCLUDING_PLANNED_LETTER, DAILY__DAILY_BALANCE_LETTER),
  ])
}

function clearOldMonthlyStatistics() {
  clearOldStatistics([
    MONTHLY__ACTUAL_INCOMES_RANGE_TEXT,
    MONTHLY__ACTUAL_EXPENSES_RANGE_TEXT,
    MONTHLY__AUX_RANGE_TEXT
  ])
}


// ======================================== PRIVATE ========================================

function clearOldStatistics(rangeTexts: string[]) {
  rangeTexts.map(rangeText => {
    const range = getRange(rangeText)

    range.clear()
    range.setDataValidation(null)
  })
}