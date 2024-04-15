const ExportJsonExcel = require("js-export-excel");

/**
 * @param {string} sheetName  excel页签名称
 * @param {string} fileName  文件名称
 * @param {string|Array} columnWidths  列宽度
 * @param {Array} sheetHeader   表头
 * @param {Array} sheetData    数据
 */

export default function excelExport({
  sheetName = "sheet",
  fileName = "excel",
  columnWidths,
  sheetHeader,
  sheetData,
}) {
  new ExportJsonExcel({
    fileName,
    datas: [
      {
        sheetFilter: sheetData[0].map((key, index) => index),
        columnWidths: sheetData[0].map((key, index) =>
          filterColumWidth(columnWidths, index)
        ),
        sheetName,
        sheetHeader,
        sheetData,
      },
    ],
  }).saveExcel();
}

function filterColumWidth(columnWidths, key) {
  if (columnWidths) {
    if (typeof columnWidths === "object") {
      if (columnWidths[key]) {
        return columnWidths[key];
      } else {
        return "4";
      }
    } else {
      return columnWidths;
    }
  } else {
    return "4";
  }
}
