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
          style="width: 240px"
          @keyup.enter.native="getList"
        ></el-input>
      </el-form-item>
      <el-form-item prop="configKey">
        <el-input
          v-model="queryParams.configKey"
          placeholder="请输入参数键名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="getList"
        ></el-input>
      </el-form-item>
      <el-form-item prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="配置类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px !important"
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
          @click="getList"
          >搜索</el-button
        >
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
      <el-form-item class="fun-btn-right">
        <el-button
          @click="handleAdd"
          icon="el-icon-plus"
          size="small"
          type="primary"
          v-hasPermi="['system:config:add']"
          >添加</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="danger"
          plain
          icon="el-icon-refresh"
          size="small"
          @click="handleRefreshCache"
          v-hasPermi="['system:config:refresh']"
          >刷新缓存</el-button
        >
      </el-form-item>
    </el-form>
    <jaya-table-group
      :total="total"
      :tableHeaderList="column"
      :tableList="configList"
      @pagination="getList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :data="configList"
    ></jaya-table-group>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="500px"
      hight="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="form.configKey" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue">
          <el-input v-model="form.configValue" placeholder="请输入参数键值" />
        </el-form-item>
        <!-- <el-form-item label="配置类型" prop="type">

          <el-radio-group v-model="form.type">
            <el-radio
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
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
    <!-- 详情 -->
    <el-dialog
      :close-on-click-modal="false"
      title="参数设置详情"
      :visible.sync="detilopen"
      width="700px"
      append-to-body
    >
      <el-form
        ref="forms"
        :model="form"
        :rules="rules"
        class="dialogForm"
        :inline="true"
        label-width="100px"
        size="mini"
        :disabled="true"
      >
        <el-form-item label="创建者" prop="createBy">
          <el-input v-model="form.createBy" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="时间" prop="createTime">
          <el-input v-model="form.createTime" />
        </el-form-item>
        <el-form-item label="更新者" prop="updateBy">
          <el-input v-model="form.updateBy" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="更新时间" prop="updateTime">
          <el-input v-model="form.updateTime" />
        </el-form-item>
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="form.configKey" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue">
          <el-input v-model="form.configValue" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="配置类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="配置类型"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            style="width: 602px"
            type="textarea"
            rows="2"
          />
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
  exportConfig,
  refreshCache,
  detilConfig,
} from "@/api/system/config";
const column = function () {
  return [
    {
      title: "参数键名",
      prop: "configKey",
      width: "220",
    },
    {
      title: "参数键值",
      prop: "configValue",
    },
    {
      title: "参数名称",
      prop: "name",
      width: "220",
    },
    {
      title: "配置类型",
      prop: "type",
    },
    {
      title: "创建者",
      prop: "createBy",
    },

    {
      title: "更新者",
      prop: "updateBy",
    },
    {
      title: "创建时间",
      prop: "createTime",
      width: "220",
    },
    {
      title: "更新时间",
      prop: "updateTime",
      width: "220",
    },

    {
      title: "操作",
      width: "180",
      type: "buttons",
      prop: "roleId",
      butList: [
        {
          title: "编辑",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleUpdate,
          auth: ["system:config:edit"],
        },
        {
          title: "详情",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.detils,
          auth: ["system:config:details"],
        },
      ],
    },
  ];
};
export default {
  name: "Config",
  data() {
    return {
      column: column.call(this),
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
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
      //显示详情弹窗
      detilopen: false,
      // 类型数据字典
      typeOptions: [
        { dictValue: 0, dictLabel: "系统参数" },
        { dictValue: 1, dictLabel: "安全参数" },
      ],
      // 日期范围
      // dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        name: undefined,
        configKey: undefined,
        type: undefined,
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
  // created() {
  //   this.getList();
  //   this.getDicts("sys_yes_no").then((response) => {
  //     this.typeOptions = response.data;
  //   });
  // },
  mounted() {
    this.getList();
  },
  methods: {
    /** 搜索按钮操作 */
    // handleQuery() {
    //   this.queryParams.pageNum = 1;
    //   this.getList();
    // },

    /** 查询参数列表 */
    getList() {
      this.queryParams.pageNum = 1;
      this.loading = true;
      this.form.params = undefined;
      listConfig(this.queryParams).then((response) => {
        response.rows.forEach((item) => {
          if (item.type === 0) {
            item.type = "系统参数";
          } else if (item.type === 1) {
            item.type = "安全参数";
          }
        });
        this.configList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 参数系统内置字典翻译
    // typeFormat(row, column) {
    //   return this.selectDictLabel(this.typeOptions, row.type);
    // },
    // 取消按钮
    cancel() {
      this.open = false;
      this.detilopen = false;
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.title = "添加参数";
      this.form = {};
      this.resetForm("form");
      this.open = true;
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.resetForm("form");
      this.title = "参数设置修改";
      const rows = { ...row };
      rows.hfx = undefined;
      this.form = rows;
      this.open = true;
    },
    // 详情
    detils(row) {
      let { id } = row;
      detilConfig({ id }).then((response) => {
        this.form = response.data;
        this.detilopen = true;
      });
    },
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.msgSuccess("刷新成功");
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            this.form.type = undefined;
            this.form.createBy = undefined;
            this.form.createTime = undefined;
            this.form.updateBy = undefined;
            this.form.updateTime = undefined;
            updateConfig(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  },
};
</script>
