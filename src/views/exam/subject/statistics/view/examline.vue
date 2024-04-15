<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh">
        <jaya-select v-model="queryParams.kcxh" type="K" />
      </el-form-item>
      <el-form-item prop="kscx">
        <jaya-select
          v-model="queryParams.kscx"
          placeholder="考试车型"
          othername="exam_car_type"
        >
        </jaya-select>
      </el-form-item>
      <el-form-item prop="ksyy">
        <jaya-select
          v-model="queryParams.ksyy"
          placeholder="考试原因"
          othername="exam_reason_type"
        >
        </jaya-select>
      </el-form-item>
      <el-form-item prop="ksrq">
        <el-date-picker
          value-format="yyyy-MM-dd"
          class="daterange"
          v-model="ksrq"
          size="small"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="">
        <el-select v-model="printStatus" placeholder="打印内容" size="small">
          <el-option
            v-for="item in print"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="">
        <el-button
          @click="getTableList(1)"
          icon="el-icon-search"
          size="small"
          type="primary"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item prop="">
        <el-button
          @click="handlePrint"
          icon="el-icon-finished"
          size="small"
          type="primary"
          >打印</el-button
        >
      </el-form-item>
      <el-form-item prop="">
        <el-button
          @click="exelExport"
          icon="el-icon-download"
          size="small"
          type="primary"
          >导出</el-button
        ></el-form-item
      >
      <el-button class="fun-btn-right" @click="back" size="small" type="primary"
        >返回</el-button
      >
    </el-form>
    <jaya-table
      v-show="printStatus === 0 || printStatus === 1"
      :tableList="tableList"
      :tableHeaderList="column"
    />
    <div style="page-break-after: always"></div>
    <div v-show="printStatus === 0 || printStatus === 2">
      <jaya-echar-bar v-if="barData" :getData="barData" />
      <jaya-echar-pie v-if="pieData" :getData="pieData" />
      <jaya-echar-line v-if="lineData" :getData="lineData" />
    </div>
  </div>
</template>

<script>
import { getExamLineQualifiedPage } from "@/api/exam/statistics";
import { exce, print } from "../mixin";
const column = function () {
  return [
    {
      title: "考试线路",
      prop: "ksxl",
      width: "120"
    },
    {
      title: "总人数",
      prop: "ksrs",
      width: "120"
    },
    {
      title: "考试人次",
      prop: "kcbh",
      width: "120"
    },
    {
      title: "合格人数",
      prop: "hgrs",
      width: "120"
    },
    {
      title: "不合格人数",
      prop: "bhgrs",
      width: "120"
    },
    {
      title: "合格率",
      prop: "hgl",
      slotFn: (item, index) => `${item.hgl}%`
    }
  ];
};
export default {
  name: "ExamLine",
  mixins: [exce, print],
  data() {
    return {
      queryParams: {},
      tableList: [],
      ksrq: [],
      barData: null,
      pieData: null,
      lineData: null,
      column: column.call(this),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  mounted() {
    document.title = "考试线路合格率";
    // this.getTableList();
  },
  methods: {
    getTableList(num) {
      getExamLineQualifiedPage({
        ...this.queryParams,
        kskssj: this.ksrq ? this.ksrq[0] : "",
        ksjssj: this.ksrq ? this.ksrq[1] : ""
      }).then((res) => {
        this.tableList = res.data;
        const nameArray = res.data.map((item) => item.ksxl);
        const dataArray = res.data.map((item) => Number(item.hgl));
        const options = {
          yAxis: [
            {
              type: "value",
              axisLabel: {
                formatter: "{value} %"
              }
            }
          ],
          series: [
            {
              type: "bar",
              data: [],
              color: "#5470c6",
              showBackground: true,
              label: {
                show: true,
                position: "top",
                formatter: "{c} %"
              }
            }
          ]
        };
        this.setBarOption(nameArray, dataArray, options);
        this.setPieOption(nameArray, dataArray);
        this.setLineOption(nameArray, dataArray);
      });
    },
    setBarOption(nameArray, dataArray, options) {
      this.barData = {
        nameArray,
        dataArray,
        textTitle: "考试线路合格率统计",
        options
      };
    },
    setPieOption(nameArray, dataArray) {
      this.pieData = {
        nameArray,
        dataArray,
        textTitle: "考试线路合格率统计"
      };
    },
    setLineOption(nameArray, dataArray) {
      this.lineData = {
        nameArray,
        dataArray,
        textTitle: "考试线路合格率统计"
      };
    },
    back() {
      this.$router.back(-1);
    }
  }
};
</script>
<style scoped>
.daterange {
  width: 220px !important;
}
</style>
