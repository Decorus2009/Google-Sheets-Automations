const TINKOFF_DATA_TYPE = "tinkoff"
const OTHER_DATA_TYPE = "other"

class UniversalDataEntry {
  isPlanned: boolean
  date: string // e.g. 1.10.2020
  amount: number // requirement: amount >=0 
  operationType: OperationType | string
  myCategory: MyCategory | string

  constructor(values: any[], dataType: "tinkoff" | "other") { // TODO replace with typeof TINKOFF_DATA_TYPE | typeof OTHER_DATA_RANGE_TEXT? 
    if (dataType === TINKOFF_DATA_TYPE) {
      
      this.isPlanned = getTinkoffDataIsPlanned(values)
      this.date = extractDateFromTinkoffDateTime(getTinkoffDataDateTime(values))
      this.amount = Math.abs(getTinkoffDataAmount(values))
      this.operationType = getTinkoffDataOperationType(values) // defined 'operation type' at preparation stage
      this.myCategory = getTinkoffDataMyCategory(values)      // defined 'my category' at preparation stage
    }
    else if (dataType === OTHER_DATA_TYPE) {

      this.isPlanned = getOtherDataIsPlanned(values)
      this.date = getOtherDataDate(values)
      this.amount = Math.abs(getOtherDataAmount(values))
      this.operationType = getOtherDataOperationType(values)
      this.myCategory = getOtherDataMyCategory(values)
    }
    else throw Error("Unknown data type to merge: " + dataType)

    // DEBUG(this)
  }

  toString(): string {
    return "UniversalDataEntry[" +
      this.isPlanned + ", " +
      this.date + ", " +
      this.amount + ", " +
      this.operationType + ", " +
      this.myCategory +
      "]"
  }
}

const universalDataEntryComparator = (entry1: UniversalDataEntry, entry2: UniversalDataEntry) => {
  return entry1.date.localeCompare(entry2.date)
}



  // constructor(tinkoffEntry: TinkoffDataRowEntry)
  // constructor(otherDataValues: any[])
  // constructor(values: TinkoffDataRowEntry | any[]) {
  //   if (values instanceof Array) {
  //     this.date = values[0]
  //     this.amount = Math.abs(values[1])
  //     this.operationType = values[2]
  //     this.category = values[3]
  //   }
  //   else {
  //     this.date = values.date
  //     this.amount = Math.abs(values.rawAmout)
  //     this.operationType = values.operationType
  //     this.category = values.myCategory
  //   }
  // }
