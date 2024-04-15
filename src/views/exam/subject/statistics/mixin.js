import excelExport from "@/utils/ExportExcel";
export const exce = {
  data() {
    return {};
  },
  methods: {
    exelExport() {
      let columns = this.exelColumn ? this.exelColumn : this.column;
      let tableLists = this.exelTableList ? this.exelTableList : this.tableList;
      excelExport({
        fileName: this.barData.textTitle,
        columnWidths: this.columnWidths,
        sheetHeader: columns.map((item) => item.title),
        sheetData: tableLists.map((item, index) =>
          columns.map((jtem) => (jtem.prop ? item[jtem.prop] : index + 1))
        )
      });
    }
  }
};

export const print = {
  data() {
    return {
      printStatus: 0,
      print: [
        { label: "打印全部", value: 0 },
        { label: "打印表格", value: 1 },
        { label: "打印图表", value: 2 }
      ]
    };
  },
  methods: {
    handlePrint() {
      // 判断是否IE
      if ("ActiveXObject" in window) {
        window.document.execCommand("print");
        return;
      } else {
        window.print();
      }
    }
  }
};
