function sortSelectedEstimationRecords0() {
  const selectedRanges = getActiveSheet().getSelection().getActiveRangeList().getRanges()

  selectedRanges.forEach(range => {
    const isEstimatedIncomesSubrange = isFullWidthSubrange(range, MONTHLY__ESTIMATED_INCOMES_RANGE_TEXT)
    const isEstimatedExpensesSubrange = isFullWidthSubrange(range, MONTHLY__ESTIMATED_EXPENSES_RANGE_TEXT)
    
    if (isEstimatedIncomesSubrange) {
      range.sort({column: range.getColumn() + MONTHLY__ESTIMATED_INCOMES_AMOUNT_POS, ascending: false})
    }

    if (isEstimatedExpensesSubrange) {
      range.sort({column: range.getColumn() + MONTHLY__ESTIMATED_EXPRENSES_AMOUNT_POS, ascending: false})
    }
  })
}


// ======================================== PRIVATE ========================================

