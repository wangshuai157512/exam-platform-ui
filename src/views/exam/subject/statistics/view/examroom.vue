<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh">
        <jaya-select v-model="queryParams.kcxh" type="K" />
      </el-form-item>
      <el-form-item prop="kscx">
        <jaya-select
          multiple
          collapse-tags
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
      <!-- <el-form-item prop="kscs">
        <el-input
          size="small"
          v-model="queryParams.kscs"
          placeholder="考试次数"
        ></el-input>
      </el-form-item> -->
      <el-form-item prop="ksy">
        <jaya-select :lable="true" v-model="queryParams.ksy" type="S" />
      </el-form-item>
      <el-form-item prop="ksrq">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          class="daterange"
          v-model="ksrq"
          size="small"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        >
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
import { getExamRoomQualifiedPage } from "@/api/exam/statistics";
import { exce, print } from "../mixin";
const column = function () {
  return [
    {
      title: "序号",
      slotFn: (item, index) => index + 1,
      width: "100"
    },
    {
      title: "考场名称",
      prop: "kcmc",
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
      title: "考试人数",
      prop: "ksrs",
      width: "120"
    },
    {
      title: "缺考人数",
      width: "120",
      prop: "qkrs"
    },
    {
      title: "合格率",
      prop: "hgl",
      slotFn: (item, index) => `${item.hgl}%`
    }
  ];
};
export default {
  mixins: [exce, print],
  name: "ExamRoom",
  data() {
    return {
      queryParams: {},
      tableList: [],
      ksrq: [
        `${this.parseTime(new Date(), "{y}-{m}-{d}")} 00:00:00`,
        `${this.parseTime(new Date(), "{y}-{m}-{d}")} 23:59:59`
      ],
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
    document.title = "考场合格率";
    // this.getTableList();
  },
  methods: {
    getTableList(num) {
      const { kscx } = this.queryParams;
      getExamRoomQualifiedPage({
        ...this.queryParams,
        kskssj: this.ksrq ? this.ksrq[0] : "",
        ksjssj: this.ksrq ? this.ksrq[1] : "",
        kscx: kscx?.join()
      }).then((res) => {
        this.tableList = res.data;
        this.setBarOption(res);
        this.setPieOption(res);
        this.setLineOption(res);
      });
    },
    // 柱状图
    setBarOption(res) {
      const nameArray = res.data.map((item) => item.kcmc);
      const dataArray = res.data.map((item) => Number(item.hgl));
      // const dataArray = new Array(4).fill().map((x, i) => ({
      //   name: ["合格人数", "不合格人数", "考试人数", "缺考人数"][i],
      //   data: [],
      // }));
      // res.data.map((t, i) => {
      //   [Number(t.hgrs), Number(t.bhgrs), Number(t.ksrs), Number(t.qkrs)].map(
      //     (j, l) => {
      //       dataArray[l].data[i] = j;
      //     }
      //   );
      // });
      this.barData = {
        nameArray,
        dataArray,
        textTitle: "考场合格率"
      };
    },
    // 饼图
    setPieOption(res) {
      const nameArray = res.data.map((item) => item.kcmc);
      const dataArray = res.data.map((item) => Number(item.hgl));
      this.pieData = {
        nameArray,
        dataArray,
        textTitle: "考场合格率"
      };
    },
    // 线图
    setLineOption(res) {
      const nameArray = res.data.map((item) => item.kcmc);
      const dataArray = res.data.map((item) => Number(item.hgl));
      this.lineData = {
        nameArray,
        dataArray,
        textTitle: "考场合格率"
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
  width: 380px !important;
}
</style>
