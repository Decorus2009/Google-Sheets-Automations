function getActiveSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
  return SpreadsheetApp.getActiveSpreadsheet()
}

function getActiveSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  return getActiveSpreadsheet().getActiveSheet()
}

// ======================================= arrays ======================================= 
/**result 2d @param array size (both rows num and cols num) should match @param targetLength */
function extend(array: string[][], targetLength: number, dummyElement: string) {
  while (array.length < targetLength) {
    addElementAsArrayTo(array, dummyElement)
  }
}

function extendWithTwoElements(array: string[][], targetLength: number, dummyElement1: string, dummyElement2: string) {
  while (array.length < targetLength) {
    addElementsAsArrayTo(array, dummyElement1, dummyElement2)
  }
}

function extendAndFillUsingRangeText(
  array: string[][],
  rangeText: string,
  dummyElement: string
) {
  const rangeToWriteResult = getRange(rangeText)

  extend(array, rangeToWriteResult.getNumRows(), dummyElement)
  fillRange(rangeToWriteResult, array)
}

function extendAndFillUsingRange(
  array: string[][],
  range: GoogleAppsScript.Spreadsheet.Range,
  dummyElement: string
) {
  while (array.length < range.getNumRows()) {
    const dummyRow = []
    for (var i = 0; i < range.getNumColumns(); i++) {
      dummyRow.push(dummyElement) 
    }

    array.push(dummyRow)
  }

  range.setValues(array)
}

/**
 * Range represents a 2d array (for a single column as well)
 * Main array corresponds to rows. Each element of that array is an array itself (even if it's corresponds to a single cell)
 */
function addElementAsArrayTo(array: string[][], element: string) {
  array.push([element]) // add element wrapped into array
}

function addElementsAsArrayTo(array: string[][], element1: string, element2: string) {
  array.push([element1, element2])
}

function inArray(array: any[], value: any): boolean {
  return array.includes(value)
}
