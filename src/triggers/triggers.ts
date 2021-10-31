/**
 * The event handler triggered when the operation type column is edited in order to make my category column selectable with a proper selection values;
 * e.g.:
 *  if operation type is income, my category column should suggest income categories
 *  if operation type is expense, my category column should suggest expense categories
 */
function onEdit(e) {
  maybeTinkoffDataIsPlannedEdited(e)
  maybeTinkoffDataOperationTypeEdited(e)
  maybeTinkoffDataMyCategoryEdited(e)

  maybeOtherDataIsPlannedEdited(e)
  maybeOtherDataDateEdited(e)
  maybeOtherDataAmountEdited(e)
  maybeOtherDataOperationTypeEdited(e)
  maybeOtherDataMyCategoryEdited(e)
  maybeOtherDataCommentEdited(e)

  maybeEstimatedMonthlyIncomesKeysEdited(e)
  maybeEstimatedMonthlyIncomesValuesEdited(e)
  maybeEstimatedMonthlyExpensesKeysEdited(e)
  maybeEstimatedMonthlyExpensesValuesEdited(e)

  maybeEstimatedSavingsPercentEdited(e)
}

function onOpen(e) {
  prepareMenus()

  makeSelectable(getFirstCellRange(getRange(MONTHLY__ESTIMATED_INCOMES_KEYS_RANGE_TEXT)), MY_INCOME_CATEGORIES_LIST)
  makeSelectable(getFirstCellRange(getRange(MONTHLY__ESTIMATED_EXPENSES_KEYS_RANGE_TEXT)), MY_EXPENSE_CATEGORIES_LIST)

  requireDateValidationForOtherDataDateColumn()
}
