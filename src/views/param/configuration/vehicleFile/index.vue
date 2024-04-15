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
          :parameter="queryParams.kcxh"
          v-model="queryParams.xh"
          type="C"
          @getOptions="getOptions"
          :isCache="false"
        ></jaya-select>
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
          v-hasPermi="['param:configuration:vehicleFile:add']"
          >添加</el-button
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
        <el-form-item label="考试车" prop="xh">
          <jaya-select
            :parameter="form.kcxh"
            v-model="form.xh"
            type="C"
            @getOptions="getFormOptions"
            :isCache="false"
          ></jaya-select>
        </el-form-item>
      </el-form>
      <jaya-upload-file
        ref="upload"
        @getFileList="getFileList"
        accept="xml,bin,ini"
        :multiple="true"
        fileTitle="信号文件"
        annotation="*注：信号文件格式必须为xml,bin,ini，示例：carinfo.xml"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportAuth"
        accept="xml"
        fileTitle="授权文件"
        annotation="*注：授权文件格式必须为xml，示例：license.xml"
      >
      </jaya-upload-file>
      <jaya-upload-file
        ref="upload"
        :http-request="handleImportBase"
        accept="db"
        fileTitle="数据库文件"
        annotation="*注：数据库文件格式必须为db，示例：teach.db"
      >
      </jaya-upload-file>
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
import { addVehicleFile, vehicleList,vehicleDownLoad } from "@/api/param/configuration";
import { drvcarSelect } from "@/api/exam/examSubject";
import { baseToBlob } from "@/utils/index";
export default {
  name: "vehicleFile",
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        kskm: "",
        kcxh: "",
        xh: "",
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
          title: "考试车型",
          width: "100",
          prop: "kscx",
        },
        {
          title: "车辆品牌",
          width: "120",
          prop: "clpp",
        },
        {
          title: "车辆名称",
          width: "150",
          prop: "clmc",
        },
        {
          title: "考车号牌",
          width: "120",
          prop: "hphm",
        },
        {
          title: "考车编号",
          width: "120",
          prop: "kcbh",
        },
        {
          title: "信号文件",
          width: "150",
          prop: "xhwjmc",
        },
        {
          title: "授权文件",
          width: "150",
          prop: "sqwjmc",
        },
        {
          title: "数据库文件",
          width: "150",
          prop: "sjkwjmc",
        },
        {
          title: "车型文件",
          prop: "cxwjmc",
          // htmlClick: this.handleCxwjmc,
          // formatter: ({ row }) => {
          //   return `<a href="javascript:;">${row.cxwjmc || ""}</a>`;
          // },
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
          title: "操作",
          width: "120",
          type: "buttons",
          fixed: "right",
          butList: [
            {
              title: "编辑",
              size: "mini",
              onClick: this.edit,
              auth: ["param:configuration:vehicleFile:edit"],
            },
          ],
        },
      ],
      showExport: true,
      tableData: [],
      form: {
        kskm: "",
        kcxh: "",
        xh: "",
      },
      rules: {
        kskm: [{ required: true, message: "必填项", trigger: "change" }],
        kcxh: [{ required: true, message: "必填项", trigger: "change" }],
        xh: [{ required: true, message: "必填项", trigger: "change" }],
      },
      openAdd: false,
      importFileSignal: null,
      importFileAuth: null,
      importFileBase: null,
      importFileModel: null,
      importFileJgclmxwj: null,
      isEdit: false,
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      vehicleList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    getOptions({ data }) {
      let examCarFilter = data.filter(
        (item) => item.value == this.queryParams.xh
      );
      if (examCarFilter.length < 1) {
        this.queryParams.xh = "";
      }
    },
    getFormOptions({ data }) {
      let examCarFilter = data.filter((item) => item.value == this.form.xh);
      if (examCarFilter.length < 1) {
        this.form.xh = "";
      }
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

    downLoadFile(row, xzwjlx, fileName) {
      const { xh } = row;
      this.queryDownFile = {
        xh,
        xzwjlx,
      };
      vehicleDownLoad(this.queryDownFile).then((res) => {
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
        xh: "",
      };
      this.resetForm("form");
    },
    // 编辑
    edit(row) {
      this.isEdit = true;
      let { kcxh, xh } = row;
      this.form.kcxh = kcxh;
      this.form.xh = xh;
      this.openAdd = true;
    },
    //上传文件
    // 多选
    getFileList(fileList) {
      this.importFileSignal = fileList.map((item) => {
        return item.raw;
      });
    },
    handleImportAuth({ file }) {
      this.importFileAuth = file;
    },
    handleImportBase({ file }) {
      this.importFileBase = file;
    },
    handleImportModel({ file }) {
      this.importFileModel = file;
    },
    handleImportJgclmxwj({ file }) {
      this.importFileJgclmxwj = file;
    },
    // 提交
    handleUpload(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (
            !this.importFileSignal &&
            !this.importFileAuth &&
            !this.importFileBase &&
            !this.importFileModel &&
            !this.importFileJgclmxwj
          ) {
            this.$message.error("请选择文件");
            return;
          }
          let formdata = new FormData();
          let { kcxh, xh } = this.form;
          let params = {
            kcxh,
            xh,
            sqwj: this.importFileAuth || new Blob(),
            sjkwj: this.importFileBase || new Blob(),
            cxwj: this.importFileModel || new Blob(),
            jgclmxwj: this.importFileJgclmxwj || new Blob(),
          };
          this.importFileSignal?.forEach((item, index) => {
            params["xhwj[" + index + "]"] = item;
          });
          for (let item in params) {
            formdata.append(item, params[item]);
          }
          let { code } = await addVehicleFile(formdata);
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
        this.importFileSignal = null;
        this.importFileAuth = null;
        this.importFileBase = null;
        this.importFileModel = null;
        this.importFileJgclmxwj = null;
      }
    },
  },
  mounted() {
    this.getTableList();
  },
  watch: {
    openAdd: {
      handler: "clearFile",
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
  width: 70px;
}
</style>
