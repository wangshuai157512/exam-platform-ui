<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          size="small"
          clearable
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.roleName"
          placeholder="角色名称"
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
          @click="handleAdd"
          v-hasPermi="['safety:auth:role:add']"
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
      v-show="openAdd"
    >
      <el-form
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
        class="dialogForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="form.roleName"
            size="small"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色英文名称" prop="roleKey">
          <el-input
            v-model="form.roleKey"
            size="small"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择" size="small">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="登录时间段（若登录时间段为空，则不限制登录时间）">
          <el-time-picker
            is-range
            v-model="formDate"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH:mm:ss"
            style="width: 100%"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-radio-group v-model="form.roleType">
            <el-radio
              v-for="item in catalogList"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item class="menu">
          <jaya-check-group
            item-data-key="children"
            lable-key="label"
            init-select-key="selected"
            :lable-data="options"
            :key="getKey"
            check-key="id"
            v-model="catalogCheckList"
          />
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" rows="3" v-model="form.remark"></el-input>
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
  roleList,
  roleAdd,
  roleEdit,
  roleMenuTreeselect
} from "@/api/exam/safety/role";
import lodash from "lodash";
let cachCheckKeyList = [];
const name = {
  roleName: "角色名称",
  roleKey: "角色英文名称",
  status: "状态",
  roleType: "权限类型",
  catalogCheckList: "权限",
  remark: "说明",
  loginStartTime: "登录开始时间",
  loginEndTime: "登录结束时间"
};
let beroreUpdate = {};
const column = function () {
  return [
    {
      title: "序号",
      width: "60",
      slotFn: (item, index) => index + 1
    },
    {
      title: "角色名称",
      prop: "roleName"
    },
    {
      title: "登录时间段",
      prop: "loginTime",
      width: "180"
    },
    {
      title: "状态",
      prop: "status",
      status: () => {
        return this.statusList;
      }
    },
    {
      title: "说明",
      prop: "remark"
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
          auth: ["safety:auth:role:edit"]
        }
      ]
    }
  ];
};
export default {
  name: "role",
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      statusList: [
        {
          label: "正常",
          value: "0"
        },
        {
          label: "停用",
          value: "1"
        }
      ],
      column: column.call(this),
      tableData: [],
      form: {
        roleType: 0
      },
      ksccList: [],
      formDate: ["", ""],
      rules: {
        roleName: [{ required: true, message: "必填项", trigger: "blur" }],
        roleKey: [{ required: true, message: "必填项", trigger: "blur" }],
        status: [{ required: true, message: "必填项", trigger: "change" }]
      },
      openAdd: false,
      isEdit: false,
      catalogList: [
        {
          label: "业务办理",
          value: 0
        },
        {
          label: "系统管理",
          value: 1
        },
        {
          label: "安全管理",
          value: 2
        },
        {
          label: "审计管理",
          value: 3
        }
      ],
      editId: "",
      catalogCheckList: [],
      options: []
    };
  },
  computed: {
    getKey() {
      return this.form.roleType + this.editId;
    }
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      roleList(this.queryParams).then((res) => {
        res.rows.forEach((item) => {
          item.loginTime =
            (item.loginStartTime || "") + "-" + (item.loginEndTime || "");
          if (
            item.loginTime === "00:00:00-00:00:00" ||
            item.loginTime === "-"
          ) {
            item.loginTime = "不限";
          }
        });
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.editId = "";
      this.form = {
        roleType: 0
      };
      this.formDate = ["", ""];
      this.getRoleMenuTreeselect();
      this.resetForm("form");
    },
    // 编辑
    edit(row) {
      this.isEdit = true;
      let {
        roleId,
        roleName,
        roleKey,
        roleType,
        status,
        remark,
        loginStartTime,
        loginEndTime
      } = row;
      this.editId = roleId;
      let queryForm = { roleId, roleName, roleKey, roleType, status, remark };
      this.form = queryForm;
      this.formDate = ["", ""];
      if (loginStartTime && loginEndTime) {
        this.formDate[0] = loginStartTime;
        this.formDate[1] = loginEndTime;
      }
      beroreUpdate = Object.assign({}, row);
      this.getRoleMenuTreeselect();
      this.resetForm("form");
    },
    // 提交
    handleUpload(formName) {
      this.$refs[formName].validate(async (valid) => {
        let catalogParams = {
          ...this.form,
          loginStartTime: this.formDate ? this.formDate[0] : null,
          loginEndTime: this.formDate ? this.formDate[1] : null,
          menuIds: [...this.catalogCheckList, ...cachCheckKeyList]
        };
        if (valid) {
          const log = this.diffLog(beroreUpdate, catalogParams, name);
          let { code } = this.isEdit
            ? await roleEdit({...catalogParams,log})
            : await roleAdd(catalogParams);
          if (code === 200) {
            this.$message({
              message: this.isEdit ? "编辑成功" : "添加成功",
              type: "success"
            });
            this.getTableList();
            this.openAdd = false;
          }
        }
      });
    },
    // 权限列表
    getRoleMenuTreeselect(newVal, oldVal) {
      const catalogCheckList = [...this.catalogCheckList];
      roleMenuTreeselect({
        roleId: this.form.roleId,
        baseRoleId: this.form.roleType
      }).then((res) => {
        if (res.data && res.data.length > 0) {
          res.data.forEach((item) => {
            if (item.children && item.children.length > 0) {
              item.children.forEach((itemChild) => {
                if (itemChild.examinerFlag == 1) {
                  itemChild.label = itemChild.label + "(警员)";
                }
              });
            }
          });
        }

        if ((newVal == 1 && oldVal == 3) || (newVal == 3 && oldVal == 1)) {
          this.options = this.dvs(res.data, cachCheckKeyList);
          cachCheckKeyList = catalogCheckList;
        } else {
          cachCheckKeyList = [];
          this.options = res.data;
        }
        if (!this.openAdd) {
          this.openAdd = true;
        }
      });
    },
    dvs(arr, keylist) {
      const list = lodash.cloneDeep(arr);
      if (keylist.length === 0) return list;
      list.forEach((child) => {
        if (child.children) {
          child.children = this.dvs(child.children, keylist);
        } else {
          if (keylist.length && keylist.includes(child.id)) {
            child.selected = true;
            return;
          }
        }
      });
      return list;
    }
  },
  mounted() {
    this.getTableList();
  },
  watch: {
    "form.roleType": {
      handler: "getRoleMenuTreeselect"
    }
  }
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
  .el-range-editor {
    padding: 0 10px !important;
  }
  .el-range-editor--medium {
    height: 32px !important;
  }
  .menu {
    width: 100%;
    /deep/.el-form-item__content {
      width: 100%;
    }
    /deep/.item-lable0 {
      position: relative;
      > .el-checkbox {
        .el-checkbox__label {
          color: #000;
          font-size: 15px;
        }
      }
      .activeA {
        position: absolute;
        left: -10px;
        top: 0;
        color: red;
      }
    }
    /deep/.item-label-box0 {
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #ccc;
      .lable1 {
        width: 120px;
        display: inline-block;
        vertical-align: top;
        margin-right: 20px;
        > .el-checkbox {
          .el-checkbox__label {
            color: #000;
            font-size: 15px;
          }
        }
      }
      .item-label-box1 {
        width: calc(100% - 140px);
        vertical-align: top;
        display: inline-block;
        .item-lable1 {
          display: inline-block;
          vertical-align: top;
          margin-left: 20px;
          position: relative;
          .item-label-box2 {
            margin-left: 20px;
            display: none;
            position: absolute;
            left: 0;
            top: 36px;
            padding: 0 10px;
            background: #f3f3f3;
            z-index: 2;
            min-width: 200px;
            .item-lable2 {
              display: inline-block;
              margin-right: 30px;
              .el-checkbox {
                margin-bottom: 0;
              }
            }
          }
        }
        .item-lable1:hover {
          .item-label-box2 {
            display: block;
          }
        }
      }
    }

    /deep/.el-checkbox {
      margin-bottom: 10px;
    }
  }
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
