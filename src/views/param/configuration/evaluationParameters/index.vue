<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <!-- <el-form-item label="" prop="kskm">
          <el-select
            v-model="queryParams.kskm"
            placeholder="考试科目"
            size="small"
          >
            <el-option
              v-for="item in kskmList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
      <el-form-item label="" prop="xmdm">
        <el-input
          v-model="queryParams.xmdm"
          size="small"
          placeholder="项目代码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="" prop="xmfl">
        <el-select
          v-model="queryParams.xmfl"
          placeholder="项目分类"
          size="small"
          clearable
        >
          <el-option
            v-for="item in xmflList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="xmzl">
        <el-select
          v-model="queryParams.xmzl"
          placeholder="项目种类"
          size="small"
          clearable
        >
          <el-option
            v-for="item in xmzlList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="" prop="kfz">
          <el-input
            v-model="queryParams.kfz"
            size="small"
            placeholder="扣分值"
          ></el-input>
        </el-form-item> -->
      <el-form-item>
        <el-button
          @click="getTableList(1)"
          icon="el-icon-search"
          size="small"
          type="primary"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="fun-btn-right">
        <el-button
          class="exportAuth"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="exelExport"
          v-hasPermi="['param:configuration:evaluationParameters:export']"
          >导出</el-button
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

    <!-- 详情文件窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="详情"
      :visible.sync="openAdd"
      width="680px"
      append-to-body
    >
      <el-form
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
        class="dialogForm"
        disabled
      >
        <el-form-item label="项目代码" prop="xmdm">
          <el-input
            v-model="form.xmdm"
            size="small"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目分类" prop="xmfl">
          <el-select v-model="form.xmfl" placeholder="请选择" size="small">
            <el-option
              v-for="item in xmflList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="xmmc">
          <el-input
            v-model="form.xmmc"
            size="small"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目性质" prop="xmxz">
          <el-select v-model="form.xmxz" placeholder="请选择" size="small">
            <el-option
              v-for="item in xmxzList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目种类" prop="xmzl">
          <el-select v-model="form.xmzl" placeholder="请选择" size="small">
            <el-option
              v-for="item in xmzlList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="扣分值" prop="kfz">
          <el-input
            v-model="form.kfz"
            size="small"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="zt">
          <el-select v-model="form.zt" placeholder="请选择" size="small">
            <el-option
              v-for="item in ztList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUpload('form')"
          >确 定</el-button
        >
        <el-button @click="openAdd = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  evaluationParametersList,
  evaluationParametersExport,
} from "@/api/param/configuration";
import { sysConfigInfo } from "@/api/exam/parameter/setting";
import { exce } from "@/views/exam/subject/statistics/mixin";
const column = function () {
  return [
    {
      title: "项目代码",
      prop: "xmdm",
    },
    {
      title: "项目分类",
      prop: "xmfl",
      status: () => this.xmflList,
    },
    {
      title: "项目名称",
      prop: "xmmc",
    },
    {
      title: "项目性质",
      prop: "xmxz",
      status: () => this.xmxzList,
    },
    {
      title: "项目种类",
      prop: "xmzl",
      status: () => this.xmzlList,
    },
    {
      title: "扣分值",
      prop: "kfz",
    },
    {
      title: "状态",
      prop: "zt",
      status: () => this.ztList,
    },
    {
      title: "操作",
      width: "150",
      type: "buttons",
      fixed: "right",
      butList: [
        {
          title: "详情",
          size: "mini",
          onClick: this.info,
          auth: ["param:configuration:evaluationParameters:info"],
        },
      ],
    },
  ];
};
const exelColumn = function () {
  return [
    {
      title: "项目代码",
      prop: "xmdm",
    },
    {
      title: "项目分类",
      prop: "excelXmfl",
    },
    {
      title: "项目名称",
      prop: "xmmc",
    },
    {
      title: "项目性质",
      prop: "excelXmxz",
    },
    {
      title: "项目种类",
      prop: "excelXmzl",
    },
    {
      title: "扣分值",
      prop: "kfz",
    },
    {
      title: "状态",
      prop: "excelZt",
    },
  ];
};
export default {
  name: "evaluationParameters",
  mixins: [exce],
  data() {
    return {
      exelColumn: exelColumn.call(this),
      exelTableList: [],
      barData: {
        textTitle: "评判参数设置",
      },
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      kskmList: [
        {
          label: "科目一",
          value: "1",
        },
        {
          label: "科目二",
          value: "2",
        },
        {
          label: "科目三",
          value: "3",
        },
      ],
      xmflList: [
        {
          label: "科目二通用评判",
          value: "A",
        },
        {
          label: "科目二专项评判",
          value: "B",
        },
        {
          label: "科目三通用评判",
          value: "C",
        },
        {
          label: "科目三专项评判",
          value: "D",
        },
      ],
      xmxzList: [
        {
          label: "标准项目",
          value: "1",
        },
        {
          label: "自定义项目",
          value: "2",
        },
      ],
      xmzlList: [
        {
          label: "项目分类",
          value: "A",
        },
        {
          label: "考试项目",
          value: "B",
        },
        {
          label: "扣分项目",
          value: "C",
        },
      ],
      column: column.call(this),
      tableData: [],
      form: {},
      ztList: [
        {
          label: "可用",
          value: "A",
        },
        {
          label: "停用",
          value: "B",
        },
      ],
      ksccList: [],
      rules: {
        // kskm: [
        //     { required: true, message: '必填项', trigger: 'change' }
        // ],
      },
      openAdd: false,
      isEdit: false,
    };
  },
  mounted() {
    this.getTableList();
    //根据科目几显示对应项目分类
    sysConfigInfo("ExamSubject").then((res) => {
      const { configValue } = res.data;
      if (configValue == "2") {
        this.xmflList = [
          {
            label: "科目二通用评判",
            value: "A",
          },
          {
            label: "科目二专项评判",
            value: "B",
          },
        ];
      } else {
        this.xmflList = [
          {
            label: "科目三通用评判",
            value: "C",
          },
          {
            label: "科目三专项评判",
            value: "D",
          },
        ];
      }
    });
  },

  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      evaluationParametersList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
      if (!document.querySelector(".exportAuth")) return;
      evaluationParametersExport(this.queryParams).then((res) => {
        res.data.forEach((item) => {
          this.xmflList.forEach((itemC) => {
            if (item.xmfl === itemC.value) {
              item.excelXmfl = itemC.label;
            }
          });
          this.xmzlList.forEach((itemC) => {
            if (item.xmzl === itemC.value) {
              item.excelXmzl = itemC.label;
            }
          });
          this.xmxzList.forEach((itemC) => {
            if (item.xmxz === itemC.value) {
              item.excelXmxz = itemC.label;
            }
          });
          this.ztList.forEach((itemC) => {
            if (item.zt === itemC.value) {
              item.excelZt = itemC.label;
            }
          });
        });
        this.exelTableList = res.data;
      });
    },
    // 详情
    info(row) {
      this.openAdd = true;
      this.form = row;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-input,
  .el-select {
    width: 194px;
  }
  .el-textarea {
    width: 602px;
  }
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
