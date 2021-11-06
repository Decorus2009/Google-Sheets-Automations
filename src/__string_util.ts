
function isNumber(value: any): boolean {
  return typeof value === 'number'
}

function asNumber(value: string): number {
  // toString call is mandatory because this method throws when reading true numbers from table,
  // there's no 'replace' method on number;
  // e.g. works for -198,00 (string) but fails for -198 (number)
  return parseFloat(value.toString().replace(',', '.'))
}

function asBoolean(value: string): boolean {
  if (!value) return false

  const strValue = value.toString().toUpperCase()
  if (strValue === 'TRUE') return true
  if (strValue === 'FALSE') return false
  return false
}

function isEmpty(value: string): boolean {
  return value === ''
}

function isEmptyTrimSpaces(value: string): boolean {
  return value.trim() === ''
}

function isNumericString(value: string): boolean {
  return /^[+-]?\d+(\.\d+)?$/.test(value)
}

function getLetterBounds(rangeText: string): string[] {
  const tags = rangeText.match(/([A-Z]+)\d+:([A-Z]+)\d+/)
  return [tags[1], tags[2]]
}

// e.g. 02.10.2021 19:22
function extractDateFromTinkoffDateTime(dateTime: string): string {
  return dateTime.split(' ')[0]
}

/**
 * It's suggested that this range looks like 'AL3', not like 'AL3:AM3'
 */
function getSingleCellLetter(rangeText: string): string {
  const tags = rangeText.match(/([A-Z]+)\d+/)
  return tags[1]
}

function DEBUG(value: any) {
  Logger.log(value.toString())
} 