<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh">
        <jaya-select v-model="queryParams.kcxh" type="K" />
      </el-form-item>
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
          v-hasPermi="['record:examline:add']"
          icon="el-icon-plus"
          size="small"
          type="primary"
          >添加</el-button
        >
        <el-button
          @click="handleDown"
          v-hasPermi="['record:examline:add']"
          icon="el-icon-download"
          size="small"
          >下载</el-button
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
        <el-form-item label="序号" prop="id">
          <el-input
            :disabled="operating == 2"
            v-model="form.id"
            placeholder="请输入序号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="所属考场" prop="kcxh">
          <jaya-select
            :disabled="operating == 2"
            v-model="form.kcxh"
            type="K"
          />
        </el-form-item>
        <el-form-item label="线路号" prop="xlh">
          <el-input v-model="form.xlh" placeholder="线路号" size="small" />
        </el-form-item>
        <el-form-item label="线路名称" prop="xlmc">
          <el-input v-model="form.xlmc" placeholder="线路名称" size="small" />
        </el-form-item>
        <el-form-item label="线路长度（米）" prop="xlcd">
          <el-input v-model="form.xlcd" placeholder="线路长度" size="small" />
        </el-form-item>
        <el-form-item label="状态" prop="zt">
          <el-select
            clearable
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
        <el-form-item label="线路经过的轨迹描述" prop="remark">
          <el-input
            style="width: 602px"
            type="textarea"
            show-word-limit
            maxlength="128"
            rows="5"
            placeholder="请输入内容"
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
  examLineNewAdd,
  examLinePageList,
  examLineUpdate,
  examLineInfo,
  examLineDown
} from "@/api/param/record";
const column = function () {
  return [
    {
      title: "序号",
      width: "60",
      slotFn: (item, index) => index + 1
    },
    {
      title: "考场简称",
      width: "150",
      prop: "kcjc"
    },
    {
      title: "线路序号",
      width: "150",
      prop: "id"
    },
    {
      title: "线路号",
      width: "120",
      prop: "xlh"
    },
    {
      title: "线路名称",
      width: "150",
      prop: "xlmc"
    },
    {
      title: "线路长度(米)",
      width: "120",
      prop: "xlcd"
    },
    {
      title: "状态",
      width: "80",
      prop: "zt",
      status: () => this.statusOption
    },
    {
      title: "修路经过的轨迹描述",
      prop: "remark"
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
          auth: ["record:examline:edit"]
        }
      ]
    }
  ];
};
export default {
  name: "ExamLine",
  data() {
    return {
      total: 0,
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      statusOption: [
        { value: 1, label: "正常" },
        { value: 0, label: "停用" }
      ],
      rules: {
        id: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ],
        kcxh: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ],
        xlh: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          },
          { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "change" }
        ],
        xlmc: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ],
        xlcd: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ],
        zt: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ]
      },
      form: {},
      visible: false,
      tableList: [],
      operating: 1, // 新增 1 修改 2
      title: "新增"
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
      examLinePageList(this.queryParams).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
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
    handleUpdate({ id }) {
      this.operating = 2;
      this.title = "修改";
      examLineInfo({ id }).then((res) => {
        this.form = res.data;
        this.visible = true;
      });
    },
    // 下载
    handleDown() {
      if (!this.queryParams.kcxh) {
        return this.msgWarn("请先选择考场");
      }
      examLineDown(this.queryParams.kcxh).then(this.getTableList);
    },

    handleSure() {
      this.visible = true;
      if (this.operating !== 3) {
        // 新增，修改 逻辑
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.operating == 1) {
              examLineNewAdd({ ...this.form, xlh: Number(this.form.xlh) }).then(
                () => {
                  this.getTableList();
                  this.msgSuccess("新增成功");
                }
              );
            } else {
              const { zt, remark, id, xlh, xlcd, xlmc } = this.form;
              examLineUpdate({
                zt,
                remark,
                id,
                xlh: Number(xlh),
                xlcd,
                xlmc
              }).then(() => {
                this.getTableList();
                this.msgSuccess("修改成功");
              });
            }
            this.visible = false;
          }
        });
      } else {
        this.visible = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
