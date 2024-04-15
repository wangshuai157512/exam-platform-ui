<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh">
        <jaya-select v-model="queryParams.kcxh" type="K" />
      </el-form-item>
      <el-form-item prop="bbh">
        <el-input
          clearable
          size="small"
          v-model="queryParams.bbh"
          placeholder="请输入版本号"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item prop="zt">
        <el-select
          clearable
          v-model="queryParams.zt"
          placeholder="状态"
          size="small"
        >
          <el-option
            v-for="status in statusOption"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="bblx">
        <el-select
          clearable
          v-model="queryParams.bblx"
          placeholder="版本类型"
          size="small"
        >
          <el-option
            v-for="version in versionType"
            :key="version.value"
            :label="version.label"
            :value="version.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item prop="">
        <el-button
          @click="getTableList(1)"
          icon="el-icon-search"
          size="small"
          type="primary"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <jaya-table-group
      :total="total"
      :tableList="tableList"
      :tableHeaderList="column"
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>
  </div>
</template>

<script>
import { getSversion } from "@/api/param/record";
const column = function () {
  return [
    {
      title: "序号",
      width: "60",
      slotFn: (item, index) => index + 1,
    },
    {
      title: "考场简称",
      prop: "kcjc",
    },
    {
      title: "版本类型",
      width: "150",
      prop: "bblx",
      status: () => this.versionType,
    },
    {
      title: "版本号",
      width: "300",
      align: "left",
      prop: "bbh",
    },
    {
      title: "版本信息",
      width: "80",
      prop: "zt",
      status: () => this.statusOption,
    },
    // {
    //   title: "合法性",
    //   width: "80",
    //   prop: "hfx",
    //   status: () => this.hfx,
    // },
    {
      title: "创建时间",
      width: "200",
      prop: "cjsj",
    },
  ];
};
export default {
  name: "version",
  data() {
    return {
      total: 0,
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      statusOption: [
        { value: 0, label: "历史版本" },
        { value: 1, label: "当前版本" },
      ],
      versionType: [
        { value: 0, label: "管理平台" },
        { value: 1, label: "系统类型" },
      ],
      // hfx: [
      //   { value: true, label: "合法" },
      //   { value: false, label: "不合法" },
      // ],
      tableList: [],
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      getSversion(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableList = res.rows;
      });
    },
  },
};
</script>
