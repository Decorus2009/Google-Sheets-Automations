function onOpen(e) {
  prepareMenus()

  makeSelectable(getFirstCellRange(getRange(MONTHLY__ESTIMATED_INCOMES_KEYS_RANGE_TEXT)), MY_INCOME_CATEGORIES_LIST)
  makeSelectable(getFirstCellRange(getRange(MONTHLY__ESTIMATED_EXPENSES_KEYS_RANGE_TEXT)), MY_EXPENSE_CATEGORIES_LIST)

  requireDateValidationForOtherDataDateColumn()

  Utilities.sleep(3000)
  highlightCurrentDate()

  // createTimeDrivenTriggers(8, 0)  
}
