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
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="synchronization"
          v-hasPermi="['param:configuration:examroomconfig:sync']"
          >同步</el-button
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
          <el-input
            v-model="form.csz"
            placeholder="请输入"
            size="small"
          >
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
      title: "参数类型",
      prop: "cslx",
      status: () => this.cslxList,
    },
    {
      title: "备注说明",
      prop: "cssm",
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
          auth: ["param:configuration:examroomconfig:edit"],
        },
      ],
    },
  ];
};
import {
  examRoomConfigList,
  examRoomConfigEdit,
  examRoomConfigSync,
} from "@/api/param/configuration";
export default {
  name: "examRoomConfig",
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        kskm: "",
        kcxh: "",
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
      form: {},
      csfwList: [],
      rules: {
        csz: [{ required: true, message: "必填项", trigger: "change" }],
      },
      openAdd: false,
      isEdit: false,
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      examRoomConfigList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    // 同步
    synchronization() {
      let { kcxh } = this.queryParams;
      examRoomConfigSync(kcxh || "").then((res) => {
        this.getTableList();
      });
    },

    // 编辑
    edit(row) {
      this.isEdit = true;
      this.openAdd = true;
      this.form = { ...this.form, ...row };
      // Object.assign(this.form, row);
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
          examRoomConfigEdit({ xh, csz }).then((res) => {
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
  },
  mounted() {
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
</style>
