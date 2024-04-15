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
      <el-form-item>
        <jaya-select
          v-model="queryParams.kscxs"
          placeholder="考试车型"
          othername="exam_car_type"
          multiple
          sty="width:200px"
        >
        </jaya-select>
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
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          v-hasPermi="['param:configuration:modelFile:add']"
          >添加</el-button
        >
        <el-button
          class="exportAuth"
          v-show="false"
          icon="el-icon-download"
          size="small"
          type="primary"
          v-hasPermi="['param:configuration:modelFile:export']"
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
      v-if="openAdd"
    >
      <el-form
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
        class="dialogForm"
      >
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
        <el-form-item label="考试场" prop="kcxh">
          <jaya-select
            type="K"
            v-model="form.kcxh"
            :disabled="isEdit"
          ></jaya-select>
        </el-form-item>
        <el-form-item label="考试车型" prop="kscx">
          <jaya-select
            v-model="form.kscx"
            placeholder="请选择"
            othername="exam_car_type"
            :disabled="isEdit"
          >
          </jaya-select>
        </el-form-item>
        <el-form-item label="车辆品牌" prop="clpp">
          <el-select
            v-model="form.clpp"
            placeholder="请选择"
            size="small"
            :disabled="isEdit"
          >
            <el-option
              v-for="item in clppList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportModel"
        accept="ini"
        fileTitle="车型文件"
        annotation="*注：车型文件格式必须为ini，示例：car.ini"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportJgclmxwj"
        accept="xls,xlsx"
        fileTitle="监管车辆模型文件"
        annotation="*注：监管车辆模型文件格式必须为xls,xlsx,zip,rar，示例：car.xlsx"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        @getFileList="getFileList"
        accept="gst,dat,id,map,tab,mdb"
        :multiple="true"
        fileTitle="地图文件"
        annotation="*注：科目二：gst,dat,id,map,tab，科目三：mdb 示例：map.gst"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportJgcdmxwj"
        accept="xls,xlsx"
        fileTitle="监管场地模型文件"
        annotation="*注：监管场地模型文件格式必须为xls,xlsx,zip,rar，示例：site.xlsx"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportElectronic"
        accept="js"
        fileTitle="电子车型文件"
        annotation="*注：电子车型文件格式必须为js，示例：C1.js"
      >
      </jaya-upload-file>

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
  addModelFile,
  modelList,
  modelDownLoad,
} from "@/api/param/configuration";
import { brandSelect } from "@/api/exam/examSubject";
import { baseToBlob } from "@/utils/index";
export default {
  name: "modelFile",
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        kskm: "",
        kcxh: "",
        kscxs: "",
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
      column: [
        {
          title: "考场简称",
          prop: "kcjc",
        },
        {
          title: "考试科目",
          prop: "kskm",
          status: () => this.kskmList,
        },
        {
          title: "考试车型",
          prop: "kscx",
          status: () => {
            return "exam_car_type";
          },
        },
        {
          title: "车辆品牌",
          prop: "clpp",
        },
        {
          title: "车型文件",
          prop: "cxwjmc",
          htmlClick: this.handleCxwjmc,
          formatter: ({ row }) => {
            return `<a href="javascript:;">${row.cxwjmc || ""}</a>`;
          },
        },
        {
          title: "监管车辆模型文件",
          prop: "jgclmxwjmc",
          htmlClick: this.handleJgclmxwjmc,
          formatter: ({ row }) => {
             return this.showExport
              ? `<a href="javascript:;" >${row.jgclmxwjmc || ""}</a>`
              : row.jgclmxwjmc;
          },
        },
        {
          title: "地图文件",
          prop: "dtwjmc",
          htmlClick: this.handleDtwjmc,
          formatter: ({ row }) => {
            return `<a href="javascript:;">${row.dtwjmc || ""}</a>`;
          },
        },
        {
          title: "监管场地模型文件",
          prop: "jgcdmxwjmc",
          htmlClick: this.handleJgcdmxwjmc,
          formatter: ({ row }) => {
            return this.showExport
              ? `<a href="javascript:;" >${row.jgcdmxwjmc || ""}</a>`
              : row.jgcdmxwjmc;
          },
        },
        {
          title: "电子车型文件",
          prop: "dzcxwjmc",
           htmlClick: this.handleDzcxwjmc,
          formatter: ({ row }) => {
            return `<a href="javascript:;">${row.dzcxwjmc || ""}</a>`;
          },
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
              auth: ["param:configuration:modelFile:edit"],
            },
          ],
        },
      ],
      showExport: false,
      tableData: [],
      queryDownFile: {}, //下载文件类型【1=车型文件，2=监管车辆模型文件，3=地图文件，4=监管场地模型文件，5=电子地图文件】
      form: {
        kskm: "",
        kcxh: "",
        kscx: "",
        clpp: "",
        xh: "",
      },
      clppList: [],
      rules: {
        kskm: [{ required: true, message: "必填项", trigger: "change" }],
        kcxh: [{ required: true, message: "必填项", trigger: "change" }],
        kscx: [{ required: true, message: "必填项", trigger: "change" }],
        // clpp: [
        //     { required: true, message: '必填项', trigger: 'change' }
        // ],
      },
      openAdd: false,
      importFileModel: null,
      importFileMap: null,
      importFileElectronic: null,
      importFileJgcdmxwj: null,
      importFileJgclmxwj: null,
      isEdit: false,
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      let queryVehicles = this.queryParams.kscxs + "";
      modelList({ ...this.queryParams, kscxs: queryVehicles }).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },

    // 下载文件
    handleCxwjmc(row) {
      if (!this.showExport) return;
      this.downLoadFile(row, "1", row.cxwjmc);
    },
    handleJgclmxwjmc(row) {
      if (!this.showExport) return;
      this.downLoadFile(row, "2", row.jgclmxwjmc);
    },
    handleDtwjmc(row) {
      if (!this.showExport) return;
      this.downLoadFile(row, "3", row.dtwjmc);
    },
    handleJgcdmxwjmc(row) {
      if (!this.showExport) return;
      this.downLoadFile(row, "4", row.jgcdmxwjmc);
    },
    handleDzcxwjmc(row) {
      if (!this.showExport) return;
      this.downLoadFile(row, "5", row.dzcxwjmc);
    },

    downLoadFile(row, xzwjlx, fileName) {
      const { kcxh, kscx, clpp } = row;
      this.queryDownFile = {
        kcxh,
        kscx,
        clpp,
        xzwjlx,
      };
      modelDownLoad(this.queryDownFile).then((res) => {
        if (!res.data) return this.msgWarn(res.msg);
        let type = fileName.substring(fileName.lastIndexOf("."));
        const link = document.createElement("a");
        const blob = baseToBlob(res.data, type);
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
          return;
        }
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
      });
    },

    // 新增
    handleAdd() {
      this.isEdit = false;
      this.openAdd = true;
      this.form = {
        kskm: "",
        kcxh: "",
        kscx: "",
        clpp: "",
        xh: "",
      };
      this.getBrandSelect();
      this.resetForm("form");
    },
    getBrandSelect() {
      let { kcxh, kscx } = this.form;
      brandSelect({ kcxh, kscx }).then((res) => {
        this.clppList = res.data;
      });
    },
    // 编辑
    edit(row) {
      this.isEdit = true;
      this.openAdd = true;
      let { kskm, kcxh, kscx, clpp, xh } = row;
      this.form.kskm = kskm;
      this.form.kcxh = kcxh;
      this.form.kscx = kscx;
      this.form.clpp = clpp;
      this.form.xh = xh;
    },
    //上传文件
    handleImportModel({ file }) {
      this.importFileModel = file;
    },
    handleImportJgcdmxwj({ file }) {
      this.importFileJgcdmxwj = file;
    },
    handleImportJgclmxwj({ file }) {
      this.importFileJgclmxwj = file;
    },
    getFileList(fileList) {
      this.importFileMap = fileList.map((item) => {
        return item.raw;
      });
    },
    handleImportElectronic({ file }) {
      this.importFileElectronic = file;
    },
    // 提交
    handleUpload(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (
            !this.importFileModel &&
            !this.importFileMap &&
            !this.importFileElectronic &&
            !this.importFileJgcdmxwj &&
            !this.importFileJgclmxwj
          ) {
            this.$message.error("请选择文件");
            return;
          }
          let formdata = new FormData();

          let params = {
            ...this.form,
            cxwj: this.importFileModel || new Blob(),
            dzcxwj: this.importFileElectronic || new Blob(),
            jgcdmxwj: this.importFileJgcdmxwj || new Blob(),
            jgclmxwj: this.importFileJgclmxwj || new Blob(),
          };
          this.importFileMap?.forEach((item, index) => {
            params["dtwj[" + index + "]"] = item;
          });
          for (let item in params) {
            formdata.append(item, params[item]);
          }

          let { code } = await addModelFile(formdata);
          if (code === 200) {
            this.$message({
              message: this.isEdit ? "编辑成功" : "添加成功",
              type: "success",
            });
            this.getTableList();
            this.openAdd = false;
          }
        }
      });
    },

    clearFile(val) {
      if (!val) {
        this.$refs.upload.clearFileName();
        this.importFileModel = null;
        this.importFileMap = null;
        this.importFileElectronic = null;
        this.importFileJgcdmxwj = null;
        this.importFileJgclmxwj = null;
        this.fileList = [];
      }
    },
  },
  mounted() {
    if (document.querySelector(".exportAuth")) {
      this.showExport = true;
    }
    this.getTableList();
  },
  watch: {
    openAdd: {
      handler: "clearFile",
    },
    "form.kcxh": {
      handler: "getBrandSelect",
    },
    "form.kscx": {
      handler: "getBrandSelect",
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
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
 /deep/.uploadFile .defaultUpload .fileTitle {
    width: 112px;
  }
</style>
