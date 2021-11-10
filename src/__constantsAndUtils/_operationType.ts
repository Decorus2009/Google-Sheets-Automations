enum OperationType {
  INCOME =       "Доход",
  EXPENSE =      "Расход",
  TRANSFER =     "Перевод",
  COMPENSATION = "Компенсация",
  EMPTY =        "", // a workaroud to avoid filling of cells without T data
}

const OPERATION_TYPES_LIST = [
  OperationType.EXPENSE,
  OperationType.INCOME,
  OperationType.TRANSFER,
  OperationType.COMPENSATION,
]
