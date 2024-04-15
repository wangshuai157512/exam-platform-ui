<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item prop="name">
        <el-input
          style="width: 180px"
          v-model="queryParams.name"
          placeholder="请输入部门名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          clearable
          v-model="queryParams.status"
          placeholder="部门状态"
          size="small"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="fun-btn-right">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          v-hasPermi="['record:managedept:add']"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->

    <el-table
      :data="deptList"
      row-key="deptId"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="部门名称"></el-table-column>
      <el-table-column prop="id" label="部门代码" width="150"></el-table-column>
      <el-table-column
        prop="orderNum"
        width="60"
        label="排序"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="statusFormat"
        width="80"
      ></el-table-column>
      <el-table-column label="创建时间" align="center" prop="cjsj" width="200">
      </el-table-column>
      <el-table-column
        width="180"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['record:managedept:edit']"
            >修改</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
            >新增</el-button
          > -->
          <!-- <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
            >删除</el-button
          > -->
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

    <!-- 添加或修改部门对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect
                size="small"
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input
                size="small"
                v-model="form.name"
                placeholder="请输入部门名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门代码" prop="id">
              <el-input
                :disabled="operating == 2"
                size="small"
                v-model="form.id"
                placeholder="请输入部门代码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发证机关" prop="fzjg">
              <jaya-select type="F" v-model="form.fzjg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                size="small"
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
  deptPageList,
  deptNewAdd,
  deptUpdate,
  deptTreeSelect,
  deptRemove,
} from "@/api/param/record";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ManageDept",
  components: { Treeselect },
  data() {
    return {
      operating: 1, // 新增 1 修改 2
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [
        {
          value: 0,
          label: "正常",
        },
        {
          value: 1,
          label: "停用",
        },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // parentId: [
        //   { required: true, message: "上级部门不能为空", trigger: "blur" },
        // ],
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" },
        ],
        fzjg: [
          { required: true, message: "发证机关不能为空", trigger: "blur" },
        ],
        id: [
          {
            required: true,
            message: "部门代码不能为空",
            trigger: "blur",
          },
          // {
          //   pattern: /^\d{12}$/,
          //   message: "输入12位数字",
          // },
        ],
      },
    };
  },
  created() {
    this.getList();
    // this.getDicts("sys_normal_disable").then((response) => {
    //   this.statusOptions = response.data;
    // });
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      deptPageList(this.queryParams).then((response) => {
        this.deptList = response.rows;
        this.total = response.total;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return node;
    },
    selectDictLabel(options, s) {
      return options.find((status) => status.value == s)?.label;
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        status: 0,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.open = true;
      this.operating = 1;
      this.title = "添加部门";
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = { ...row };
      this.operating = 2;
      this.open = true;
      this.title = "修改部门";
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.operating == 2) {
            const field = [
              "id",
              "orderNum",
              "parentId",
              "status",
              "name",
              "fzjg",
            ];
            const form = {};
            field.map((k) => {
              form[k] = this.form[k];
            });
            deptUpdate(form).then(() => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            deptNewAdd(this.form).then(() => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deptRemove({ id: row.id });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-col {
  margin-bottom: 16px;
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
