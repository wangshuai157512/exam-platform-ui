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
      <el-form-item prop="ksrq">
        <el-date-picker
          class="daterange"
          v-model="ksrq"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          popper-class="data_picker"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '00:00:00']"
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
import { exce, print } from "../mixin";
import { getExamPointQualifiedPage } from "@/api/exam/statistics";
const column = function () {
  return [
    {
      title: "序号",
      slotFn: (item, index) => index + 1,
      width: "100",
    },
    {
      title: "扣分项目",
      prop: "xmmc",
    },
    {
      title: "扣分次数",
      prop: "kfcs",
      width: "120",
    },

    {
      title: "自动评判",
      width: "120",
      prop: "hgcs",
    },
    {
      title: "人工评判",
      width: "120",
      prop: "bhgcs",
    },
    {
      title: "占比",
      width: "120",
      prop: "kfl",
    },
  ];
};
export default {
  name: "Deduction",
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
      columnWidths: { 1: "20" },
    };
  },
  mounted() {
    document.title = "扣分项目";
    // this.getTableList();
  },
  methods: {
    getTableList() {
      getExamPointQualifiedPage({
        ...this.queryParams,
        kskssj: this.ksrq ? this.ksrq[0] : "",
        ksjssj: this.ksrq ? this.ksrq[1] : "",
      }).then(({ data }) => {
        this.tableList = data;
        const nameArray = data.map((item) => item.xmmc);
        const dataArray = data.map((item) => Number(item.kfcs));
        this.setBarOption(data);
        this.setPieOption(nameArray, dataArray);
        this.setLineOption(nameArray, dataArray);
      });
    },
    setBarOption(data) {
      const filterArr = data.filter((item) => Number(item.kfcs) > 0);
      const nameArray = filterArr.map((item) => item.xmmc);
      const dataArray = filterArr.map((item) => Number(item.kfcs));

      this.barData = {
        nameArray,
        dataArray,
        textTitle: "扣分项目统计",
      };
    },
    setPieOption(nameArray, dataArray) {
      this.pieData = {
        nameArray: [...nameArray.slice(0, 11), "其他"],
        dataArray: dataArray
          .slice(0, 11)
          .concat(dataArray.slice(12).reduce((a, b) => a + b)),
        textTitle: "扣分项目统计",
      };
    },
    setLineOption(nameArray, dataArray) {
      this.lineData = {
        nameArray,
        dataArray,
        textTitle: "扣分项目统计",
      };
    },
    back() {
      this.$router.back(-1);
    },
  },
};
</script>
<style lang="scss" scoped >
.daterange {
  width: 380px !important;
}
</style>
