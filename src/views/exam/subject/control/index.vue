<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <jaya-select type="K" v-model="queryParams.kcxh"></jaya-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.kszt"
          placeholder="考试状态"
          size="small"
          clearable
        >
          <el-option
            v-for="item in ksztList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="kczt">
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
      :tableHeaderList="column"
      :tableList="tableData"
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>
  </div>
</template>

<script>
import { controlList, controlExamStatus } from "@/api/exam/examSubject";
import { getInfo } from "@/api/login";
const column = function () {
  return [
    {
      title: "考场简称",
      prop: "kcjc",
    },
    {
      title: "考试科目",
      prop: "kskm",
    },
    {
      title: "预约人数",
      prop: "yyrs",
    },
    {
      title: "已考人数",
      prop: "ykrs",
    },
    {
      title: "未考人数",
      prop: "wkrs",
    },
    {
      title: "考试状态",
      prop: "kszt",
      status: () => this.ksztList,
    },
    {
      title: "操作",
      width: "150",
      type: "buttons",
      butList: [
        {
          title: (row) => {
            return row.kszt === "B" ? "开始考试" : "停止考试";
          },
          size: "mini",
          onClick: this.examStatus,
          auth: ["exam:subject:control:startExam"],
        },
      ],
    },
  ];
};
export default {
  name: "control",
  data() {
    return {
      total: 0,
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        kcxh: "",
        kszt: "",
      },
      ksztList: [
        {
          label: "开始考试",
          value: "A",
        },
        {
          label: "停止考试",
          value: "B",
        },
      ],
      tableData: [],
      roleNames: "",
    };
  },
  created() {
    getInfo().then(({ data }) => {
      this.roleNames = data.roleName;
        
    });
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      controlList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    examStatus(row) {
      this.$confirm(
        row.kszt === "B"
          ? `确认开始${row.kcjc}考试吗？【${this.roleNames}】指定为本考场考试员1`
          : `确认停止${row.kcjc}考试吗？`,
        "提示",
       
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        let examStatusParams = {
          kcxh: row.kcxh,
          kszt: row.kszt === "B" ? "A" : "B",
        };
        controlExamStatus(examStatusParams).then((res) => {
          this.$message({
            message:
              row.kszt === "A"
                ? `${row.kcjc}已停止考试`
                : `${row.kcjc}已开始考试`,
            type: "success",
          });
          this.getTableList();
        });
      });
    },
  },
  mounted() {
    this.getTableList();
  },
};
</script>
