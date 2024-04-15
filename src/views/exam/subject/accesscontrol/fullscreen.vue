<template>
  <div>
    <jaya-table
      :tableList="tableList"
      :tableHeaderList="column"
    ></jaya-table>
  </div>
</template>

<script>
import { getAccessPageList } from "@/api/exam/access";
const column = function () {
  return [
    {
      title: "序号",
      slotFn: (item, index) => index + 1,
      width: "80",
    },
    {
      title: "考场简称",
      prop: "kcjc",
      width: "160",
    },
    {
      title: "姓名",
      prop: "xm",
      width: "120",
    },
    {
      title: "身份证",
      prop: "sfzmhm",
      width: "220",
    },
    {
      title: "考试科目",
      prop: "kskm",
      width: "120",
      status: () => {
        return this.suject;
      },
    },
    {
      title: "考试日期",
      prop: "ksrq",
      width: "120",
      slotFn: (item) => item.ksrq?.split(" ")[0],
    },
    {
      title: "进入时间",
      prop: "jrsj",
      width: "160",
    },
    {
      title: "比对环节",
      prop: "bdhj",
      width: "160",
      status: () => {
        return this.comparison;
      },
    },
    {
      title: "闸机入口",
      prop: "zjrk",
      width: "160",
      status: () => {
        return this.entrance;
      },
    },
    {
      title: "备注",
      prop: "bz",
    }
  ];
};
let timer
export default {
  name: "fullscreen",
  data() {
    return {
      tableList: [],
      column: column.call(this),
      queryParams: { pageNum: 1, pageSize: 50 },
      comparison: [
        { label: "候考室闸机", value: 1 },
        { label: "待考室闸机", value: 2 },
      ], // 比对环节
      entrance: [
        { label: "入口", value: 1 },
        { label: "出口", value: 2 },
      ], //闸机入口
      suject: [
        { value: "2", label: "科目二" },
        { value: "3", label: "科目三" },
      ],
    };
  },
    methods: {
    getTableList() {
      getAccessPageList(this.queryParams).then((res) => {
        this.tableList = res.rows;
      });
    },
    fullScreen() {
        var el = document.documentElement
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
        if(typeof rfs != "undefined" && rfs) {
            console.log(rfs)
            rfs.call(el)
        }
        if (typeof window.ActiveXObject != "undefined") {
            wscript = new ActiveXObject("WScript.Shell");
            if (wscript) {
            wscript.SendKeys("{F11}");
            }
        }
    }
  },
  mounted() {
    // this.fullScreen()
    let query = JSON.parse(localStorage.getItem('tableQuery'))
    this.queryParams = {...query,...this.queryParams}
    this.getTableList();
     timer = setInterval(()=> {
        this.getTableList();
     },3000)
  },
  destroyed() {
    clearInterval(timer)
    timer = null
  }
};
</script>