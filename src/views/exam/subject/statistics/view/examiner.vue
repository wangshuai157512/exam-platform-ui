<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="ksy">
        <jaya-select :lable="true" v-model="queryParams.ksy" type="S" />
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
import { getExamInerQualifiedPage } from "@/api/exam/statistics";
import { exce, print } from "../mixin";
const column = function () {
  return [
    {
      title: "考试员",
      prop: "ksy",
      width: "120"
    },
    {
      title: "考生人数",
      prop: "ksrs",
      width: "120"
    },
    {
      title: "合格人数",
      prop: "hgrs",
      width: "120"
    },
    {
      title: "考生合格率",
      prop: "hgl"
    }
  ];
};
export default {
  name: "ExamIner",
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
    document.title = "考试员合格率";
    // this.getTableList();
  },
  methods: {
    getTableList(num) {
      getExamInerQualifiedPage({
        ...this.queryParams,
        kskssj: this.ksrq ? this.ksrq[0] : "",
        ksjssj: this.ksrq ? this.ksrq[1] : ""
      }).then((res) => {
        this.tableList = res.data;
        const nameArray = res.data.map((item) => item.ksy);
        const dataArray = res.data.map((item) => Number(item.hgl));
        // const
        this.setBarOption(nameArray, dataArray);
        this.setPieOption(nameArray, dataArray);
        this.setLineOption(nameArray, dataArray);
      });
    },
    setBarOption(nameArray, dataArray) {
      this.barData = {
        nameArray,
        dataArray,
        textTitle: "考试员合格率统计"
      };
    },
    setPieOption(nameArray, dataArray) {
      this.pieData = {
        nameArray,
        dataArray,
        textTitle: "考试员合格率统计"
      };
    },
    setLineOption(nameArray, dataArray) {
      this.lineData = {
        nameArray,
        dataArray,
        textTitle: "考试员合格率统计"
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
  width: 240px !important;
}
</style>
