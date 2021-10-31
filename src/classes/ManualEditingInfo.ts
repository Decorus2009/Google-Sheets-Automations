const MANUAL_EDITING_INFO_DELIMITER = ' '
const NUMBER_OF_FLAGS_IN_MANUAL_EDITING_INFO = 3

const IS_PLANNED_FLAG_POS = 0
const OPERATION_TYPE_FLAG_POS = 1
const MY_CATEGORY_FLAG_POS = 2

class ManualEditingInfo {
  isIsPlannedChecked: boolean
  isOperationTypeEdited: boolean
  isMyCategoryEdited: boolean

  constructor(value: string) {
    if (!value) {
      this.setAllFalse()
    }

    const strValue = value.toString()
    const splitted = strValue.split(MANUAL_EDITING_INFO_DELIMITER)

    if (splitted.length !== NUMBER_OF_FLAGS_IN_MANUAL_EDITING_INFO) {
      this.setAllFalse()
    }

    this.isIsPlannedChecked = splitted[IS_PLANNED_FLAG_POS] === this.TRUE_CODE
    this.isOperationTypeEdited = splitted[OPERATION_TYPE_FLAG_POS] === this.TRUE_CODE
    this.isMyCategoryEdited = splitted[MY_CATEGORY_FLAG_POS] === this.TRUE_CODE

    // DEBUG(this.toString())
  }

  markIsPlannedEdited(): ManualEditingInfo {
    this.isIsPlannedChecked = true
    return this
  }
  
  markIsPlannedNotEdited(): ManualEditingInfo {
    this.isIsPlannedChecked = false
    return this
  }

  markOperationTypeEdited(): ManualEditingInfo {
    this.isOperationTypeEdited = true
    return this
  }

  markOperationTypeNotEdited(): ManualEditingInfo {
    this.isOperationTypeEdited = false
    return this
  }

  markMyCategoryEdited(): ManualEditingInfo {
    this.isMyCategoryEdited = true
    return this
  }

  markMyCategoryNotEdited(): ManualEditingInfo {
    this.isMyCategoryEdited = false
    return this
  }

  private setAllFalse() {
    this.isIsPlannedChecked = false
    this.isOperationTypeEdited = false
    this.isMyCategoryEdited = false
  }

  private TRUE_CODE = '1'
  private FALSE_CODE = '0'

  toString(): string {
    return [this.isIsPlannedChecked, this.isOperationTypeEdited, this.isMyCategoryEdited]
      .map(it => {
        if (it) return this.TRUE_CODE
        else return this.FALSE_CODE
      })
      .join(MANUAL_EDITING_INFO_DELIMITER)
  }
}