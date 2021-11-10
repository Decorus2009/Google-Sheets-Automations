class TinkoffDataRowEntry {
  // raw values
  rawDateTime: string
  rawStatus: string
  rawAmout: number
  rawTinkoffCategory: TinkoffCategory
  rawMCC: number
  rawDescription: string

  // derived values
  date: string
  myCategory: MyCategory | string
  operationType: OperationType | string
  manualEditingInfo: ManualEditingInfo
  isPlanned: boolean

  /**
   * columns:
   * [
   *   Дата операции,	Дата платежа,	Номер карты,	Статус,	Сумма операции,	
   *   Валюта операции, Сумма платежа,	Валюта платежа,	Кэшбэк,	
   *   Категория,	MCC,	Описание,	Бонусы (включая кэшбэк),	Округление на инвесткопилку,	Сумма операции с округлением
   * ]
   */
  constructor(tinkoffDataValues: any[]) { 
    this.rawDateTime = getTinkoffDataDateTime(tinkoffDataValues)
    this.rawStatus = getTinkoffDataStatus(tinkoffDataValues)
    this.rawAmout = asNumber(getTinkoffDataAmount(tinkoffDataValues)) // maybe use Math.abs(...) ? but why?
    this.rawTinkoffCategory = getTinkoffDataTinkoffCategory(tinkoffDataValues)
    this.rawMCC = asNumber(getTinkoffDataMCC(tinkoffDataValues))
    this.rawDescription = getTinkoffDataDescription(tinkoffDataValues)

    this.date = extractDateFromTinkoffDateTime(this.rawDateTime)
    this.manualEditingInfo = new ManualEditingInfo(getTinkoffDataManualEditingInfo(tinkoffDataValues))

    // depend on manual editing info
    this.isPlanned = this.maybeDefineIsPlanned(getTinkoffDataIsPlanned(tinkoffDataValues))
    this.operationType = this.maybeDefineOperationType(getTinkoffDataOperationType(tinkoffDataValues))
    this.myCategory = this.maybeDefineMyCategory(getTinkoffDataMyCategory(tinkoffDataValues))

    // DEBUG(this.toString())
  }

  shouldBeRemoved(): boolean {
    return isMolniaEntryToRemove(this) || this.rawStatus === TinkoffOperationStatus.FAILED
  }

  /**
   * @param defaultValue means that a value might be already manually set before (in 'T' column), so reuse it
   */
  private maybeDefineIsPlanned(defaultValue: boolean): boolean {
    // if 'is planned' has been edited earlier, use a value manually specified in a checkbox 
    // a value in checkbox might TRUE or FALSE - it doesn't matter, we take it from checkbox
    if (this.manualEditingInfo.isIsPlannedChecked) {
      return defaultValue
    }

    return false
  }

  /**
   * @param defaultValue means that a value might be already manually set before (in 'AJ' column), so reuse it
   */
  private maybeDefineOperationType(defaultValue: string): OperationType | string {
    // if 'operation type' has been edited earlier, use a value set manually by a user 
    if (this.manualEditingInfo.isOperationTypeEdited) {
      return defaultValue
    }

    // not to fill cells out of T data range
    if (this.rawDateTime === '') {
      return OperationType.EMPTY
    }

    if (this.rawAmout < 0) {
      return OperationType.EXPENSE
    }

    if (this.isTransfer()) {
      return OperationType.TRANSFER
    }

    if (inArray([
      TINKOFF__INCOME_DESCRIPTION_SPECIAL_CASES.PURCHASE_REWARD, 
      TINKOFF__INCOME_DESCRIPTION_SPECIAL_CASES.BALANCE_INTEREST,
      TINKOFF__INCOME_DESCRIPTION_SPECIAL_CASES.TRAVEL_BONUS
    ], this.rawDescription)) {
      return OperationType.INCOME
    }

    return OperationType.INCOME
    // return OperationType.EMPTY
  }

  /**
   * @param defaultValue means that a value might be already manually set before (in 'AK' column), so reuse it
   * 
   * @returns 'my category' which might be further manually adjusted if defined incorretly 
   * (there're lots of different cases, e.g. MOLNIA as a transport, but not as an entertainment)
   */
  private maybeDefineMyCategory(defaultValue: string): MyCategory | string | undefined {
    // if 'my category' has been edited earlier, use a value set manually by a user 
    if (this.manualEditingInfo.isMyCategoryEdited) {
      return defaultValue
    }

    // Special cases (crutches): 
    if (isTransport(this))                  return MyExpenseCategory.TRANSPORT
    if (isTinkoffProSubscription(this))     return MyExpenseCategory.SUBSCRIPTIONS
    if (isTinkoffOperationCommission(this)) return MyExpenseCategory.COMMISSION
    if (isAppStoreITunesSubscription(this)) return MyExpenseCategory.SUBSCRIPTIONS
    if (isRostelecomInternetPayment(this))  return MyExpenseCategory.REGULAR_HOUSE_COMMUNICATNION_BILLS
    if (isMtsMobile(this))                  return MyExpenseCategory.REGULAR_HOUSE_COMMUNICATNION_BILLS
    if (isMealty(this))                     return MyExpenseCategory.FOOD_ORDERING
    
    // transfers by a card number should be handled manually,
    // transfers by a phone number seem to don't have mcc => undefined is returned as well
    if (isTransferByCardNumber(this))       return undefined

    if (isTinkoffBalanceInterest(this))     return MyIncomeCategory.DEPOSIT_SAVINGS_ACCOUNT_INTEREST
    if (isTinkoffCashback(this))            return MyIncomeCategory.CASHBACK
  

    const tinkoffCategory = tinkoffCategoryFrom(this.rawMCC)

    return tinkoffCategoriesToMyExpenseCategories().get(tinkoffCategory)
  }
 
  private isTransfer(): boolean {
    const code = this.rawMCC
    const description = this.rawDescription
    const FINANCIAL_SERVICES_CODE = 6012

    // e.g. transfer from Sberbank card
    if (isNumber(code) && code === FINANCIAL_SERVICES_CODE && description === TINKOFF__TRANSFER_DESCRIPTION_SPECIAL_CASES.TRANSFER_FROM_CARD) {
      return true
    }

    if (inArray([TINKOFF__TRANSFER_DESCRIPTION_SPECIAL_CASES.TRANSFER_BETWEEN_ACCOUNTS, TINKOFF__TRANSFER_DESCRIPTION_SPECIAL_CASES.DEPOSIT_CLOSING], description)) {
      return true
    }

    return false
  }

  toString(): string {
    return "TRawDataRowEntry[" +
      this.isPlanned + ", " +
      this.rawDateTime + ", " +
      this.rawAmout + ", " + (typeof this.rawAmout) + " " +
      this.rawTinkoffCategory.toString() +
      ", code(" + this.rawMCC + ") " +
      this.rawDescription + ", " +
      this.date + ", " +
      this.operationType + ", " +
      this.myCategory + ", " +
      this.manualEditingInfo +
      "]"
  }
}