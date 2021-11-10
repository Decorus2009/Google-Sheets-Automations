function createTimeDrivenTriggers(hour: number, minute: number) {
  ScriptApp.newTrigger("highlightCurrentDate")
    .timeBased()
    .atHour(hour)
    .nearMinute(minute)
    .everyDays(1)
    .create();

  // ScriptApp.newTrigger('highlightCurrentDate')
  // .timeBased()
  // .everyMinutes(1)
  // .create();

  // throw Error(getCurrentDate())
}

function highlightCurrentDate() {
  const datesRange = getRange(DAILY__DATE_RANGE_TEXT)
  const datesValues = datesRange.getDisplayValues()
  const currentDate = getCurrentDate()

  for (const rowInd in datesValues) {
    const date = datesValues[rowInd][0]

    if (date === currentDate) {
      getSingleCellRange(datesRange, asNumber(rowInd), 0)
        .setBorder(true, true, true, true, false, false, CURRENT_DATE_BORDER_COLOR, SpreadsheetApp.BorderStyle.SOLID)
    }
  }

}


// ======================================== PRIVATE ========================================

function getCurrentDate(): string {
  return Utilities.formatDate(new Date(), TIME_ZONE, DATE_FORMAT)
}