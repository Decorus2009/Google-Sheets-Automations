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

function clearOldDailyAndMonthlyStatistics() {
  [
    MONTHLY__ACTUAL_INCOMES_RANGE_TEXT,
    MONTHLY__ACTUAL_EXPENSES_RANGE_TEXT,
    getDailyRangeText(DAILY__EXPENSE_INCLUDING_PLANNED_LETTER, DAILY__DAILY_BALANCE_LETTER),
    MONTHLY__AUX_RANGE_TEXT
  ].map(rangeText => {
    const range = getRange(rangeText)

    range.clear()
    range.setDataValidation(null)
  })
}