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

	// should be called before triggers below so that they don't interfere on 
	// row cells clearing
	maybeWholeOtherDataRowsCleared(e)

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

	formatAllValues()
}