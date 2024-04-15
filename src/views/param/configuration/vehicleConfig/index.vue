<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <!-- <el-form-item>
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
      <el-form-item>
        <jaya-select type="K" v-model="queryParams.kcxh"></jaya-select>
      </el-form-item>
      <el-form-item v-if="!showPage">
        <el-select
          v-model="queryParams.csfl"
          placeholder="参数分类"
          size="small"
          clearable
        >
          <el-option
            v-for="item in csflList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.cssx"
          placeholder="参数属性"
          size="small"
          clearable
        >
          <el-option
            v-for="item in cssxList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.csmc"
          placeholder="参数名称"
          size="small"
        >
        </el-input>
      </el-form-item>
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
          v-show="!queryParams.kcxh"
          type="primary"
          icon="el-icon-plus"
          size="small"
          v-hasPermi="['param:configuration:vehicleConfig:import']"
          @click="handleImportant"
          style="margin-right: 10px"
          >导入</el-button
        >
        <jaya-upload-file
          v-show="queryParams.kcxh"
          ref="upload"
          :http-request="handleImport"
          accept="ctk"
          fileTitle="车型文件"
          annotation="*注：车型文件格式必须为ctk，示例：car.ctk"
          :singleBtnUpload="true"
          class="up_load_config"
          style="display: inline-block; margin-right: 10px"
        >
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            v-hasPermi="['param:configuration:vehicleConfig:export']"
            style="width: 73px"
          >
            导入</el-button
          >
        </jaya-upload-file>
        <el-button
          class="exportAuth"
          @click="exelExport"
          icon="el-icon-download"
          size="small"
          type="primary"
          v-hasPermi="['param:configuration:vehicleConfig:export']"
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

    <!-- 添加文件窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="isEdit ? '编辑' : '添加'"
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
      >
        <el-form-item label="参数名称" prop="csmc">
          <el-input
            v-model="form.csmc"
            placeholder="参数名称"
            :disabled="isEdit"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="参数分类" prop="csfl">
          <el-select
            v-model="form.csfl"
            placeholder="参数分类"
            :disabled="isEdit"
            size="small"
          >
            <el-option
              v-for="item in csflList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数属性" prop="cssx">
          <el-select
            v-model="form.cssx"
            placeholder="参数属性"
            :disabled="isEdit"
            size="small"
          >
            <el-option
              v-for="item in cssxList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数范围" prop="csfw">
          <el-input
            v-model="form.csfw"
            placeholder="参数范围"
            :disabled="isEdit"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="考场简称" prop="kcxh">
          <jaya-select type="K" v-model="form.kcxh" disabled></jaya-select>
        </el-form-item>
        <!-- <el-form-item label="考试科目" prop="kskm">
          <el-select
            v-model="form.kskm"
            placeholder="请选择"
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
        <el-form-item label="考试车型" prop="kscx">
          <jaya-select
            v-model="form.kscx"
            placeholder="考试车型"
            othername="exam_car_type"
            :disabled="isEdit"
            sty="width:200px"
          >
          </jaya-select>
        </el-form-item>
        <el-form-item label="考车号牌" prop="hmhp">
          <el-input
            v-model="form.hphm"
            placeholder="请输入"
            :disabled="isEdit"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="考车编号" prop="kcbh">
          <el-input
            v-model="form.kcbh"
            placeholder="请输入"
            :disabled="isEdit"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="默认值" prop="mrz">
          <el-input
            v-model="form.mrz"
            placeholder="请输入"
            :disabled="isEdit"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="参数值"
          prop="csz"
          v-if="form.csfw && form.csfw.indexOf('\\') !== -1"
        >
          <el-select v-model="form.csz" placeholder="请选择" size="small">
            <el-option
              v-for="item in csfwList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数值" prop="csz" v-else>
          <el-input v-model="form.csz" placeholder="请输入" size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            type="textarea"
            rows="3"
            v-model="form.cssm"
            :disabled="isEdit"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEdit('form')">确 定</el-button>
        <el-button @click="openAdd = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const column = function () {
  return [
    {
      title: "考场简称",
      prop: "kcjc",
    },
    {
      title: "考试科目",
      prop: "kskm",
      status: () => {
        return this.kskmList;
      },
    },
    {
      title: "参数名称",
      prop: "csmc",
      width: "230",
    },

    {
      title: "参数值",
      prop: "csz",
    },
    {
      title: "说明",
      prop: "cssm",
      width: "240",
    },

    {
      title: "考试车型",
      width: "150",
      prop: "kscx",
      status: () => {
        return "exam_car_type";
      },
    },
    {
      title: "考车号牌",
      prop: "hphm",
    },
    {
      title: "考车编号",
      prop: "kcbh",
    },
    {
      title: "参数范围",
      prop: "csfw",
    },
    {
      title: "参数分类",
      prop: "csfl",
    },
    {
      title: "参数属性",
      prop: "cssx",
      status: () => this.cssxList,
    },

    {
      title: "默认值",
      prop: "mrz",
    },
    {
      title: "参数类型",
      prop: "cslx",
      status: () => this.cslxList,
    },
    {
      title: "操作",
      width: "150",
      type: "buttons",
      fixed: "right",
      butList: [
        {
          title: "编辑",
          size: "mini",
          onClick: this.edit,
          auth: ["param:configuration:vehicleConfig:edit"],
        },
      ],
    },
  ];
};
const exelColumn = function () {
  return [
    {
      title: "考场简称",
      prop: "kcjc",
    },
    {
      title: "考试科目",
      prop: "excelKskm",
    },
    {
      title: "参数名称",
      prop: "csmc",
    },
    {
      title: "参数分类",
      prop: "csfl",
    },
    {
      title: "参数属性",
      prop: "excelCssx",
    },
    {
      title: "考试车型",
      width: "150",
      prop: "kscx",
      status: () => {
        return "exam_car_type";
      },
    },
    {
      title: "考车号牌",
      prop: "hphm",
    },
    {
      title: "考车编号",
      prop: "kcbh",
    },
    {
      title: "参数范围",
      prop: "csfw",
    },
    {
      title: "参数值",
      prop: "csz",
    },
    {
      title: "默认值",
      prop: "mrz",
    },
    {
      title: "备注说明",
      prop: "cssm",
    },
  ];
};
import {
  vehicleConfigList,
  vehicleConfigExport,
  vehicleUploadConfig,
  vehicleConfigEdit,
} from "@/api/param/configuration";
import { exce } from "@/views/exam/subject/statistics/mixin";
export default {
  name: "vehicleConfig",
  mixins: [exce],
  data() {
    return {
      showPage: location.href.split("?")[1],
      exelColumn: exelColumn.call(this),
      exelTableList: [],
      barData: {
        textTitle: location.href.split("?")[1] ? "客户端参数" : "车载参数配置",
      },
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        kskm: "",
        kcxh: "",
        csfl: "",
        cssx: "",
        csmc: "",
      },
      kskmList: [
        {
          label: "科目二",
          value: "2",
        },
        {
          label: "科目三",
          value: "3",
        },
      ],
      csflList: [
        {
          label: "通用参数",
          value: "通用参数",
        },
        {
          label: "评判参数",
          value: "评判参数",
        },
      ],
      cssxList: [
        {
          label: "通用参数",
          value: "0",
        },
        {
          label: "车辆持有",
          value: "1",
        },
        {
          label: "车型持有",
          value: "2",
        },
      ],
      column: column.call(this),
      tableData: [],
      cslxList: [
        {
          label: "字符串",
          value: "0",
        },
        {
          label: "单选框",
          value: "1",
        },
        {
          label: "数字",
          value: "2",
        },
        {
          label: "IP",
          value: "3",
        },
      ],
      form: {
        csmc: "",
        csfl: "",
        cssx: "",
        csfw: "",
        kcxh: "",
        kskm: "",
        hmhp: "",
        mrz: "",
        csz: "",
        cssm: "",
      },
      csfwList: [],
      rules: {
        csz: [{ required: true, message: "必填项", trigger: "change" }],
      },
      openAdd: false,
      importFileConfig: null,
      isEdit: false,
    };
  },

  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      vehicleConfigList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
      if (!document.querySelector(".exportAuth")) return;
      vehicleConfigExport(this.queryParams).then((res) => {
        res.data.forEach((item) => {
          if (item.kskm === "1") {
            item.excelKskm = "科目一";
          } else if (item.kskm === "2") {
            item.excelKskm = "科目二";
          } else if (item.kskm === "3") {
            item.excelKskm = "科目三";
          }
          if (item.cssx === "0") {
            item.excelCssx = "通用参数";
          } else if (item.cssx === "1") {
            item.excelCssx = "车辆特有";
          } else if (item.cssx === "2") {
            item.excelCssx = "车型特有";
          }
        });
        this.exelTableList = res.data;
      });
    },

    // 编辑
    edit(row) {
      // this.form = {};
      this.resetForm("form");
      this.isEdit = true;
      this.openAdd = true;
      // this.form.kscxs =row.kscx;
      Object.assign(this.form, row);
      let { csfw } = row;
      if (csfw) {
        this.csfwList = csfw.split("\\");
        let newCsfwList = [];
        this.csfwList.forEach((item, index) => {
          item = {
            label: item,
            value: item,
          };
          newCsfwList.push(item);
        });
        this.csfwList = newCsfwList;
      }
    },
    // 编辑
    handleEdit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let { xh, csz } = this.form;
          vehicleConfigEdit({ xh, csz }).then((res) => {
            this.$message({
              message: "编辑成功",
              type: "success",
            });
            this.openAdd = false;
            this.getTableList();
          });
        }
      });
    },
    handleImportant() {
      this.$message({
        message: "请选择考场",
        type: "warning",
      });
    },
    //上传文件
    handleImport({ file }) {
      this.$refs.upload.clearFileName();
      this.importFileConfig = null;
      this.importFileConfig = file;
      this.handleUpload();
    },
    // 提交
    async handleUpload() {
      if (!this.queryParams.kcxh) {
        this.$message.error("请选择考场");
        return;
      }
      let formdata = new FormData();
      formdata.append("czpzwj", this.importFileConfig);
      formdata.append("kcxh", this.queryParams.kcxh);
      let { code } = await vehicleUploadConfig(formdata);
      this.$message({
        message: "上传成功",
        type: "success",
      });
      this.getTableList();
    },
  },
  mounted() {
    this.queryParams.csfl = location.href.split("?")[1] ? "客户端参数" : "";
    this.getTableList();
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
    /deep/.el-textarea__inner {
      color: red;
    }
  }
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
.up_load_config {
  /deep/ .el-button {
    span {
      display: inline-block;
      width: 24px;
    }
  }
}
</style>
