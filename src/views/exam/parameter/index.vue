<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入参数名称"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="configKey">
        <el-input
          v-model="queryParams.configKey"
          placeholder="请输入参数键名"
          clearable
          size="small"
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item  prop="hidden">
        <el-select 
        v-model="queryParams.hidden" 
        placeholder="是否隐藏" 
        clearable size="small" 
        style="width: 150px">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
             @keyup.enter.native="handleQuery"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item>
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="fun-btn-right" prop="">
        <el-button
          @click="handleAdd"
          icon="el-icon-plus"
          size="small"
          type="primary"
          v-hasPermi="['exam:parameter:add']"
          >添加</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="configList" :row-class-name="tableRowClassName">
      <el-table-column label="参数主键" align="center" prop="id" />
      <el-table-column label="参数名称" align="center" prop="name" />
      <el-table-column label="参数键名" align="center" prop="configKey" />
      <el-table-column label="参数键值" align="center" prop="configValue" />
      <el-table-column label="是否隐藏" align="center" prop="isHidden" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="cjsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.cjsj) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['exam:parameter:details']"
            >修改</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            @click="handlexiangqing(scope.row)"
            disabled:false
          >详情</el-button> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
           
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="name" style="margin: 23px">
          <el-input v-model="form.name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey" style="margin: 23px">
          <el-input v-model="form.configKey" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue" style="margin: 23px">
          <el-input v-model="form.configValue" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden" style="margin: 23px">
          <el-radio-group v-model="form.hidden">
            <el-radio
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
          style="width: 515px; margin: 23px"
        >
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  parameterAdd,
  parameterlist,
  parameterupdate,
  sysConfigInfo,
} from "@/api/exam/parameter/setting";

export default {
  name: "Config",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      // single: true,
      // 非多个禁用
      // multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 参数表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [
        {
          dictLabel: "是",
          dictValue: 1,
        },
        {
          dictLabel: "否",
          dictValue: 0,
        },
      ],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        name: "",
        configKey: "",
        hidden: undefined,
      },
      // 表单参数
      form: {},

      // 表单校验
      rules: {
        name: [
          { required: true, message: "参数名称不能为空", trigger: "blur" },
        ],
        configKey: [
          { required: true, message: "参数键名不能为空", trigger: "blur" },
        ],
        // configValue: [
        //   { required: true, message: "参数键值不能为空", trigger: "blur" },
        // ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询参数列表 */
    getList(row) {
      this.loading = true;
      parameterlist(this.queryParams).then((res) => {
        res.rows.forEach((item) => {
          if (item.hidden === 0) {
            item.isHidden = "否";
          } else if (item.hidden === 1) {
            item.isHidden = "是";
          }
        });
        this.configList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      parameterlist(this.queryParams).then((res) => {
        this.configList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
      // this.getList();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "添加参数";
      this.form = {};
      this.resetForm("form");
    },
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.id)
    //   this.single = selection.length!=1
    //   this.multiple = !selection.length
    // },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = {};
      this.resetForm("form");
      this.title = "修改";
      this.open = true;
      const rows = { ...row };
      rows.hfx = undefined;
      this.form = rows;
    },
    /** 详情按钮操作 */
    // handlexiangqing(row) {
    // this.title = "详情";
    // this.open = true;
    // const rows = { ...row };
    // this.form = rows;
    // },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        this.form.type = undefined;
        this.form.createBy = undefined;
        this.form.cjsj = undefined;
        this.form.updateBy = undefined;
        this.form.gxsj = undefined;
        this.form.isHidden = undefined;
        if (valid) {
          if (this.form.id != undefined) {
            parameterupdate(this.form).then((res) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            parameterAdd(this.form).then((response) => {
              this.msgSuccess("添加成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // /** 删除按钮操作 */
    // handleDelete(row) {
    //   const configIds = row.id || this.ids;
    //   this.$confirm('是否确认删除参数编号为"' + configIds + '"的数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return delConfig(configIds);
    //     }).then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     }).catch(() => {});
    // },
    // 设置特殊行颜色
    tableRowClassName({ row }) {
      if (row.hfx === false) {
        return "danger-row";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .el-table {
  /deep/ .danger-row {
    background: red;
  }
}
</style>
