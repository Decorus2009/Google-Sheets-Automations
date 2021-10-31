
// var numericValuesOffset = 2
// var monthlyIncomeRangeText = 'A3:B23'
// // var monthlyIncomeTotalCellText = 'B24'

// var monthlyConsumptionRangeText = 'D3:E23'
// // var monthlyConsumptionTotalCellText = 'E24'

// var datesRangeText = 'G3:G33';
// var dailyConsumptionRangeText = 'H3:H33'
// var dailyIncomeRangeText = 'I3:I33';
// var dailyTransactionRangeText = 'J3:J33'
// // var dailyBudgetRangeText = 'K3:K33'
// // var dailyBalanceRangeText = 'L3:L33'
// var dailyBudgetRangeLetter = "K"
// var dailyBalanceRangeLetter = "L"
// var dailyBudgetAndBalanceRangeText = 'K3:L33'
// var defaultDailyBudgetCellText = 'D29'

// var allValuesRangeText = 'O3:S1000'; // all values from Coinkeeper/Tinkoff table

// var consumptionOperation = "Расход";
// var incomeOperation = "Доход";
// var transactionOperation = "Перевод";

// var backgroundColor = '#d3e1e4'

// // function onEdit(e) {
// //   // SpreadsheetApp.getActiveSheet().getRange('I22').setValue('Hello');
// //   SpreadsheetApp.getActiveSheet().getRange(monthlyConsumptionTotalCell).setValue(totalMonthlyConsumption(monthlyConsumptionRange));

// //   fillDailyStatistics();
// // }

// function refresh() {
//   fillMonthlyIncomeStatistics(allValuesRangeText, monthlyIncomeRangeText)

//   fillMonthlyConsumptionStatistics(allValuesRangeText, monthlyConsumptionRangeText)
//   // fillMonthlyConsumptionTotal(monthlyConsumptionTotalCellText)

//   fillDailyStatistics()
// }



// // ===================================== Months =====================================

// function fillMonthlyIncomeStatistics(allValuesRangeText, rangeToWriteResultText) {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet();
//   var allValues = sheet.getRange(allValuesRangeText).getValues();

//   var categoriesToIncomeSources = new Map();

//   for (var rowInd in allValues) {
//     var rowDataValues = allValues[rowInd];
//     var income = rowDataValues[1];
//     var operation = rowDataValues[2];
//     var source = rowDataValues[3];
   
//     if (operation === incomeOperation) {
//       var sourceCurrentIncomeValue = categoriesToIncomeSources.get(source);

//       if (!sourceCurrentIncomeValue) {
//         categoriesToIncomeSources.set(source, income);
//       } else {
//         categoriesToIncomeSources.set(source, sourceCurrentIncomeValue + income);
//       }
//     }
//   }

//   var resultArray = [];
//   for (const [key, value] of categoriesToIncomeSources) {
//     resultArray.push([key, value])
//   }

//   var rangeToWriteResult = sheet.getRange(rangeToWriteResultText)
  
//   // result 2d array size (both rows num and cols num) should match that in rangeToWriteResult
//   while (resultArray.length < rangeToWriteResult.getNumRows()) {
//     resultArray.push(['', ''])
//   }

//   // resultArray contains 2-element arrays kind of: ['ALM',	10000]
//   // we need to sort them in descending order by total consumption by category
//   // empty arrays (['',	'']) are considered as well
//   resultArray.sort(function(entry1, entry2) {
//     if (entry1[0] === '') {
//       return 1; // positive, because of descending
//     }
//     if (entry2[0] === '') {
//       return 1; // positive, because of descending
//     }

//     return entry2[1] - entry1[1]; // descending
//   })
  
//   rangeToWriteResult.setValues(resultArray);
//   rangeToWriteResult.setBackground(backgroundColor)
// }

// function fillMonthlyConsumptionStatistics(allValuesRangeText, rangeToWriteResultText) {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet();
//   var allValues = sheet.getRange(allValuesRangeText).getValues();

//   var categoriesToConsumptions = new Map();

//   for (var rowInd in allValues) {
//     var rowDataValues = allValues[rowInd];
//     var consumption = rowDataValues[1];
//     var operation = rowDataValues[2];
//     var category = rowDataValues[4];
   
//     if (operation === consumptionOperation) {
//       var categoryCurrentConsumptionValue = categoriesToConsumptions.get(category);

//       if (!categoryCurrentConsumptionValue) {
//         categoriesToConsumptions.set(category, consumption);
//       } else {
//         categoriesToConsumptions.set(category, categoryCurrentConsumptionValue + consumption);
//       }
//     }
//   }

//   var resultArray = [];
//   for (const [key, value] of categoriesToConsumptions) {
//     resultArray.push([key, value])
//   }

//   var rangeToWriteResult = sheet.getRange(rangeToWriteResultText)
  
//   // result 2d array size (both rows num and cols num) should match that in rangeToWriteResult
//   while (resultArray.length < rangeToWriteResult.getNumRows()) {
//     resultArray.push(['', ''])
//   }

//   // resultArray contains 2-element arrays kind of: ['Транспорт',	2133]
//   // we need to sort them in descending order by total consumption by category
//   // empty arrays (['',	'']) are considered as well
//   resultArray.sort(function(entry1, entry2) {
//     if (entry1[0] === '') {
//       return 1; // positive, because of descending
//     }
//     if (entry2[0] === '') {
//       return 1; // positive, because of descending
//     }

//     return entry2[1] - entry1[1]; // descending
//   })
  
//   rangeToWriteResult.setValues(resultArray);
//   rangeToWriteResult.setBackground(backgroundColor)
// }

// // function fillMonthlyConsumptionTotal(monthlyConsumptionTotalCellText) {
// //   var sheet = SpreadsheetApp.getActiveSpreadsheet();
// //   var rowValues = sheet.getRange(monthlyConsumptionRangeText).getValues()

// //   var sum = 0;

// //   for (var rowInd in rowValues) {
// //     var value = rowValues[rowInd][1]
// //     if (value === "") {
// //       continue;
// //     }

// //     sum += value;
// //   }

// //   sheet.getRange(monthlyConsumptionTotalCellText).setValue(sum)
// // }





// // ====================================== Days ======================================

// function fillDailyStatistics() {
//   dailyStatistics(datesRangeText, allValuesRangeText, dailyConsumptionRangeText, consumptionOperation); // Consumption
//   dailyStatistics(datesRangeText, allValuesRangeText, dailyIncomeRangeText, incomeOperation); // Income
//   dailyStatistics(datesRangeText, allValuesRangeText, dailyTransactionRangeText, transactionOperation); // Transaction
  
//   dailyBudgetAndBalance(
//     datesRangeText, 
//     dailyConsumptionRangeText, 
//     defaultDailyBudgetCellText, 
//     dailyBudgetAndBalanceRangeText,
//     dailyBudgetRangeLetter, 
//     dailyBalanceRangeLetter,  
//     numericValuesOffset
//   )
// }

// function dailyStatistics(datesRangeText, allValuesRangeText, rangeToWriteResultText, operation) {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet();
//   // NB: date cell are interpreted in the format: e.g.: Thu Jun 25 2020 01:00:00 GMT+0300 (Moscow Standard Time)
//   // whereas they are displayed as 25.06.2020
//   // Coinkeeper data column contains string in the format 25.06.2020, so we have compare strings not date objects
//   var dateValues = sheet.getRange(datesRangeText).getDisplayValues(); 
//   var allValues = sheet.getRange(allValuesRangeText).getValues();

//   // Logger.log(dateValues[0][0]);
//   // Logger.log(allValues[0][0]);
//   Logger.log(dateValues[0][0].toString() === allValues[0][0].toString()); // dates comparison 

//   var resultArray = [];

//   for (var dateInd in dateValues) {
//     // Logger.log(dateValues[dateInd]);
//     var currentDateString = dateValues[dateInd][0].toString(); // e.g.: Thu Jun 25 2020 01:00:00 GMT+0300 (Moscow Standard Time)
        
//     var sum = 0;

//     for (var rowInd in allValues) {
//       var rowDataValues = allValues[rowInd]

//       if (rowDataValues[0].toString() === currentDateString && rowDataValues[2] === operation) {
//         sum += rowDataValues[1];
//       }
//     }

//     var resultSingleElementArrayValue = undefined;
//     if (sum === 0) {
//       resultSingleElementArrayValue = "";
//     } else {
//       resultSingleElementArrayValue = sum;
//     }
    
//     resultArray.push([resultSingleElementArrayValue]);
//   }

//   var rangeToWriteResult = sheet.getRange(rangeToWriteResultText)
//   rangeToWriteResult.setValues(resultArray);
//   rangeToWriteResult.setBackground(backgroundColor)
// }

// /**
//  * param [rangeToWriteResultText] represents 2 columns: dailyBudget, dailyBalance
//  */
// function dailyBudgetAndBalance(
//   datesRangeText, 
//   dailyConsumptionRangeText, 
//   defaultDailyBudgetCellText, 
//   rangeToWriteResultText,
//   dailyBudgetRangeLetter, 
//   dailyBalanceRangeLetter, 
//   numericValuesOffset
// ) {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet();
//   var dateValues = sheet.getRange(datesRangeText).getValues();
//   var consumptionValues = sheet.getRange(dailyConsumptionRangeText).getValues();
//   var defaultDailyBudget = sheet.getRange(defaultDailyBudgetCellText).getValues()[0][0]; // single cell

//   // Logger.log(dateValues[0][0]);
//   // Logger.log(allValues[0][0]);
//   // Logger.log(dateValues[0][0].toString() === allValues[0][0].toString()); // dates comparisson 

//   var firstDayConsumption = consumptionValues[0][0]
//   var initialDailyBalance = defaultDailyBudget - firstDayConsumption
  
//   var resultArray = [];
//   resultArray.push([defaultDailyBudget, initialDailyBalance])

//   var prevDayBudgetAndBalance = resultArray[0]
//   // 0 index-related value has been calculated above
//   for (var ind = 1; ind < dateValues.length; ind++) {
//     // if date cell is empty (month contains less than 30 days, e.g. June 2020 in coinkeeper)
//     if (dateValues[ind][0] === '') {
//       break;
//     }

//     var prevDayBalance = prevDayBudgetAndBalance[1]
//     var curDayBudget = prevDayBalance + defaultDailyBudget
    
//     var curDayConsumption = consumptionValues[ind][0]

//     // var curDayConsumption = 0.0
//     // if (consumptionValues[ind][0] !== '') {
//     //   curDayConsumption = consumptionValues[ind][0]
//     // }

//     var curDayBalance = curDayBudget - curDayConsumption

//     resultArray.push([curDayBudget, curDayBalance])

//     prevDayBudgetAndBalance = [curDayBudget, curDayBalance]

//     // Logger.log('cons: ' + consumptionValues[ind][0]);
//     // Logger.log('==========================');
//   }

//   var rangeToWriteResult = sheet.getRange(rangeToWriteResultText)

//     // result 2d array size (both rows num and cols num) should match that in rangeToWriteResult
//   while (resultArray.length < rangeToWriteResult.getNumRows()) {
//     resultArray.push(['', ''])
//   }
//   rangeToWriteResult.setValues(resultArray);
//   rangeToWriteResult.setBackground(backgroundColor)

//   for (rowInd in resultArray) {
//     var budget = resultArray[rowInd][0]
//     var balance = resultArray[rowInd][1]
//     var curRowPosition = parseInt(rowInd) + 1 + numericValuesOffset // rowId is string somehow

//     // set cell's font
//     if (budget > 0) {
//       Logger.log(dailyBudgetRangeLetter + curRowPosition + ':' + dailyBudgetRangeLetter + curRowPosition);

//       sheet.getRange(dailyBudgetRangeLetter + curRowPosition + ':' + dailyBudgetRangeLetter + curRowPosition).setFontColor('black'); 
//     }
//     // set cell's font
//     if (balance > 0) {
//       sheet.getRange(dailyBalanceRangeLetter + curRowPosition + ':' + dailyBalanceRangeLetter + curRowPosition).setFontColor('red'); 
//     }
//   }
// }
