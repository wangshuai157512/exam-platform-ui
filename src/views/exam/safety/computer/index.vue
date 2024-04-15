<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <el-select
          v-model="queryParams.type"
          placeholder="计算机类型"
          size="small"
          clearable
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
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
        <el-select
          v-model="queryParams.lockStatus"
          placeholder="锁定状态"
          size="small"
          clearable
        >
          <el-option
            v-for="item in lockStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          v-hasPermi="['exam:safety:computer:add']"
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
        <el-form-item label="管理部门" prop="deptId">
          <jaya-select type="UB" v-model="form.deptId"></jaya-select>
        </el-form-item>
        <el-form-item label="计算机类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计算机名称" prop="computerName">
          <el-input
            v-model="form.computerName"
            placeholder="请输入"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择"
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
        <el-form-item label="IP" prop="ip" class="gain">
          <el-input
            v-model="form.ip"
            placeholder="请输入"
            size="small"
          ></el-input>
          <el-button type="primary" @click="getIp" size="small"
            >获取本机IP</el-button
          >
        </el-form-item>
        <el-form-item label="MAC" prop="mac" class="gain">
          <el-input
            v-model="form.mac"
            placeholder="请输入"
            size="small"
          ></el-input>
          <el-button type="primary" @click="getMac" size="small"
            >获取本机MAC</el-button
          >
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
  computerList,
  computerAdd,
  computerEdit,
  computerLock,
  computerGetIp
} from "@/api/exam/safety/computer";
const column = function () {
  return [
    {
      title: "序号",
      width: "60",
      slotFn: (item, index) => index + 1
    },
    {
      title: "所属部门",
      prop: "deptName"
    },
    {
      title: "计算机名称",
      prop: "computerName"
    },
    {
      title: "IP",
      prop: "ip"
    },
    {
      title: "MAC",
      prop: "mac",
      width: "200"
    },
    {
      title: "计算机类型",
      prop: "type",
      status: () => {
        return this.typeList;
      }
    },
    {
      title: "状态",
      prop: "status",
      status: () => {
        return this.statusList;
      }
    },
    {
      title: "锁定状态",
      prop: "lockStatus",
      status: () => {
        return this.lockStatusList;
      }
    },
    {
      title: "说明",
      prop: "remark"
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
          auth: ["exam:safety:computer:edit"]
        },
        {
          title: (row) => {
            return row.lockStatus === 0 ? "锁定" : "解锁";
          },
          size: "mini",
          onClick: this.lock,
          auth: ["exam:safety:computer:lock"]
        }
      ]
    }
  ];
};
const name = {
  deptId: "管理部门",
  type: "计算机类型",
  status: "状态",
  computerName: "计算机名称",
  IP: "IP",
  remark: "说明",
  MAC: "MAC"
};
let beroreUpdate = {};
export default {
  name: "computer",
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      typeList: [
        {
          label: "考试辅助管理机 ",
          value: 0
        },
        {
          label: "参数设置管理机",
          value: 1
        },
        {
          label: "自助签到机",
          value: 2
        },
        {
          label: "自助报到机",
          value: 3
        },
        {
          label: "排考叫号机",
          value: 4
        },
        {
          label: "自助查询机",
          value: 5
        },
        {
          label: "入候考室闸机",
          value: 6
        },
        {
          label: "入考场闸机",
          value: 7
        },
        {
          label: "自助签名机",
          value: 8
        },
        {
          label: "信息采集机",
          value: 9
        },
        {
          label: "评判采集软件",
          value: 10
        }
      ],
      lockStatusList: [
        {
          label: "正常",
          value: 0
        },
        {
          label: "锁定",
          value: 1
        }
      ],
      statusList: [
        {
          label: "停用",
          value: 0
        },
        {
          label: "正常",
          value: 1
        }
      ],
      column: column.call(this),
      tableData: [],
      form: {
        ip: "",
        mac: ""
      },
      rules: {
        deptId: [{ required: true, message: "必填项", trigger: "change" }],
        type: [{ required: true, message: "必填项", trigger: "change" }],
        status: [{ required: true, message: "必填项", trigger: "change" }],
        computerName: [{ required: true, message: "必填项", trigger: "blur" }],
        ip: [
          { required: true, message: "必填项", trigger: "change" },
          {
            pattern:
              /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确的ip地址",
            trigger: "change"
          }
        ],
        mac: [
          { required: true, message: "必填项", trigger: "change" },
          {
            pattern: /^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$/,
            message: "请输入正确的mac地址",
            trigger: "change"
          }
        ]
      },
      openAdd: false,
      isEdit: false
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      computerList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },

    getIp() {
      computerGetIp().then((res) => {
        this.form.ip = res.data;
      });
    },
    getMac() {
      let myMac = document.getElementById("obj").GetMac;
      if (!myMac) {
        this.$alert("请使用IE浏览器获取或手动输入", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      this.form.mac = myMac;
    },
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.form = {
        ip: "",
        mac: ""
      };
      this.resetForm("form");
      this.openAdd = true;
    },
    // 编辑
    edit(row) {
      this.isEdit = true;
      let { id, deptId, type, computerName, status, ip, mac, remark } = row;
      let queryForm = {
        id,
        deptId,
        type,
        computerName,
        status,
        ip,
        mac,
        remark
      };
      this.form = queryForm;
      this.openAdd = true;
      beroreUpdate = Object.assign({}, row);
    },
    // 提交
    handleUpload(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const log = this.diffLog(beroreUpdate, this.form, name);
          let { code } = this.isEdit
            ? await computerEdit({ ...this.form, log })
            : await computerAdd(this.form);
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

    // 锁定/解锁
    async lock(row) {
      let { id, lockStatus } = row;
      let { code } = await computerLock({ id });
      if (code === 200) {
        this.$message({
          message: lockStatus ? "已解锁" : "已锁定",
          type: "success"
        });
        this.getTableList();
      }
    }
  },
  mounted() {
    this.getTableList();
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
  .gain {
    /deep/ .el-button--medium {
      padding: 10px;
    }
  }
  .el-radio {
    margin-right: 10px;
  }
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
