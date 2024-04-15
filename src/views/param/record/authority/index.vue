<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="zt">
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
      <el-form-item prop="">
        <el-button
          @click="getTableList(1)"
          icon="el-icon-search"
          size="small"
          type="primary"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="fun-btn-right" prop="">
        <el-button
          @click="handleAddVisible"
          v-hasPermi="['record:examstaff:add']"
          icon="el-icon-plus"
          size="small"
          type="primary"
          >添加</el-button
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
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="visible"
      width="680px"
      append-to-body
    >
      <el-form
        class="dialogForm"
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
      >
        <el-form-item label="发证机关" prop="fzjg">
          <el-input
            :disabled="operating == 2"
            size="small"
            v-model="form.fzjg"
            placeholder="发证机关"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="zt">
          <el-select
            clearable
            style="width: 194px"
            v-model="form.zt"
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
        <el-form-item label="备注" prop="remark">
          <el-input
            style="width: 400px"
            rows="5"
            show-word-limit
            maxlength="30"
            type="textarea"
            placeholder="请输入备注"
            v-model="form.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSure">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPageList,
  authorNewAdd,
  getStatus,
  authorUpdate,
} from "@/api/param/record";
const column = function () {
  return [
    {
      title: "序号",
      width: "60",
      slotFn: (item, index) => index + 1,
    },
    {
      title: "发证机关",
      width: "150",
      prop: "fzjg",
    },
    {
      title: "状态",
      width: "80",
      prop: "zt",
      status: () => this.statusOption,
    },
    {
      title: "备注",
      prop: "remark",
    },
    {
      title: "操作",
      width: "150",
      type: "buttons",
      prop: "roleId",
      butList: [
        {
          title: "修改",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleUpdate,
          auth: ["record:examstaff:edit"],
        },
      ],
    },
  ];
};
export default {
  name: "Authority",
  data() {
    return {
      total: 0,
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      statusOption: [
        { value: 0, label: "正常" },
        { value: 1, label: "停用" },
      ],
      rules: {
        fzjg: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        zt: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
      },
      form: {},
      visible: false,
      tableList: [],
      operating: 1, // 新增 1 修改 2
      title: "新增",
    };
  },
  mounted() {
    this.getTableList();
    // getStatus().then((res) => {});
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      getPageList(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableList = res.rows;
      });
    },

    // 新增
    handleAddVisible() {
      this.operating = 1;
      this.title = "新增";
      this.form = {};
      this.resetForm("form");
      this.visible = true;
    },

    // 修改
    handleUpdate({ id, fzjg, zt, remark }) {
      this.operating = 2;
      this.title = "修改";
      this.form = { id, fzjg, zt, remark };
      this.visible = true;
    },

    handleSure() {
      this.visible = true;
      if (this.operating) {
        // 新增，修改 逻辑
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.operating == 1) {
              authorNewAdd(this.form).then(() => {
                this.getTableList();
                this.msgSuccess("新增成功");
              });
            } else {
              authorUpdate(this.form).then(() => {
                this.getTableList();
                this.msgSuccess("修改成功");
              });
            }
            this.visible = false;
          }
        });
      }
    },
  },
};
</script>
