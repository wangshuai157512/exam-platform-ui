<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="action_name">
        <el-select
          v-model="queryParams.action_name"
          placeholder="操作类型"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="category">
        <el-select
          v-model="queryParams.category"
          placeholder="日志分类"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="dict in categoryOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="obj_name">
        <el-input
          v-model="queryParams.obj_name"
          placeholder="对象名称"
          clearable
          style="width: 150px"
          size="small"
        />
      </el-form-item>

      <el-form-item prop="">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 220px !important"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getTableList(1)"
          >搜索</el-button
        >
        <!-- <el-button
          type="primary"
          icon="el-icon-data-line"
          size="small"
          @click="chartQuery"
          v-hasPermi="['exam:safety:logcenter:databaseaudit:chartQuery']"
          >显示图表</el-button
        > -->
      </el-form-item>
    </el-form>
    <jaya-table-group
      :total="total"
      :tableHeaderList="column"
      :tableList="tableList"
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>
    <!-- <el-dialog
      :close-on-click-modal="false"
      title="操作日志图表"
      :visible.sync="tubiaoopen"
      width="700px"
      append-to-body
    >
      <jaya-echar-bar v-if="barDatas" :getData="barDatas" />
      <jaya-echar-bar v-if="barData" :getData="barData" />
    </el-dialog> -->

    <!-- 详情 -->
    <el-dialog
      :close-on-click-modal="false"
      title="数据库审计日志详情"
      :visible.sync="open"
      width="85%"
      append-to-body
    >
      <el-form
        ref="form"
        class="dialogForm"
        :inline="true"
        :model="form"
        label-width="215px"
        size="mini"
        :disabled="true"
      >
        <el-form-item label="操作系统账户" prop="osusername">
          <el-input v-model="form.osusername" size="small" />
        </el-form-item>
        <el-form-item label="数据库用户名" prop="username">
          <el-input v-model="form.username" size="small" />
        </el-form-item>
        <el-form-item label="客户端名称" prop="terminal">
          <el-input v-model="form.terminal" size="small" />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="form.ip" size="small" />
        </el-form-item>
        <el-form-item label="MAC" prop="mac">
          <el-input v-model="form.mac" size="small" />
        </el-form-item>
        <el-form-item label="操作时间" prop="timestamp">
          <el-input v-model="form.timestamp" size="small" />
        </el-form-item>
        <el-form-item label="所有者" prop="owner">
          <el-input v-model="form.owner" size="small" />
        </el-form-item>
        <el-form-item label="对象名称" prop="objname">
          <el-input v-model="form.objname" size="small" />
        </el-form-item>
        <el-form-item label="操作类型" prop="actionname">
          <el-select
            v-model="form.actionname"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="textarea" label="SQL语句" prop="sqltext">
          <!-- <el-input v-model="form.sqltext" size="small" /> -->
          <el-input
            v-model="form.sqltext"
            type="textarea"
            class="inputShow"
            :rows="12"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="textarea" label="SQL参数" prop="sqlbind">
          <el-input
            v-model="form.sqlbind"
            type="textarea"
            class="inputShow"
            :rows="12"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  databaselist,
  databasedetails,
  databasetype,
  databaseoperation
} from "@/api/exam/safety/logcenter";
const column = function () {
  return [
    {
      title: "序号",
      slotFn: (item, index) => index + 1,
      width: "80"
    },
    {
      title: "操作系统账户",
      prop: "osusername"
    },
    {
      title: "数据库用户名",
      prop: "username"
    },
    {
      title: "客户端名称",
      prop: "terminal"
    },
    {
      title: "IP",
      prop: "ip"
    },
    {
      title: "MAC",
      prop: "mac"
    },
    {
      title: "操作时间",
      prop: "timestamp",
      width: "200"
    },
    //  {
    //   title: "日志明细",
    //   prop: "logInfo",
    //   width:'280'
    // },
    {
      title: "所有者",
      prop: "owner"
    },
    {
      title: "对象名称",
      prop: "objname"
    },
    {
      title: "操作类型",
      prop: "actionname"
    },

    {
      title: "SQL语句",
      prop: "sqltext",
      width: "200"
    },

    {
      title: "SQL参数",
      prop: "sqlbind",
      width: "200"
    },

    {
      title: "操作",
      width: "150",
      type: "buttons",
      fixed: "right",
      butList: [
        {
          title: "详情",
          size: "mini",
          onClick: this.handleDetail,
          auth: ["exam:safety:logcenter:databaseaudit:detail"]
        }
      ]
    }
  ];
};
export default {
  name: "Safelog",
  data() {
    return {
      column: column.call(this),
      // 遮罩层
      loading: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      tubiaoopen: false,
      //图表
      // barData: null,
      // barDatas: null,
      tableList: [],
      form: {},
      //日期
      dateRange: [
        this.parseTime(new Date(), "{y}-{m}-{d}"),
        this.parseTime(new Date(), "{y}-{m}-{d}")
      ],

      // 类型数据字典
      statusOptions: [
        { value: "SELECT", label: "查询" },
        { value: "INSERT", label: "插入" },
        { value: "UPDATE", label: "更新" },
        { value: "DELETE", label: "删除" }
      ],

      //日志分类
      categoryOptions: [
        { value: "1", label: "软件用户" },
        { value: "2", label: "访问参数" },
        { value: "3", label: "车辆参数" },
        { value: "4", label: "模型参数" },
        { value: "5", label: "评判参数" }
      ],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20
      }
    };
  },
  // mounted() {
  //   this.getTableList();
  // },
  methods: {
    /** 查询列表 */
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      this.loading = true;

      databaselist({
        ...this.queryParams,
        start_date: this.dateRange ? this.dateRange[0] : "",
        end_date: this.dateRange ? this.dateRange[1] : ""
      }).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    //图表
    // chartQuery() {
    //   this.tubiaoopen = true;
    //   databaseoperation(this.queryParams).then((res) => {
    //     // this.tableList = res.data;
    //     const nameArray = [];
    //     const dataArray = [];
    //     res.data.forEach((item) => {
    //       nameArray.push(item.name);
    //       dataArray.push(Number(item.total));
    //     });
    //     this.setBarOptions(nameArray, dataArray);
    //   });

    //   databasetype(this.queryParams).then((res) => {
    //     // this.tableList = res.data;
    //     const nameArray = [];
    //     const dataArray = [];
    //     res.data.forEach((item) => {
    //       nameArray.push(item.name);
    //       dataArray.push(Number(item.total));
    //     });
    //     this.setBarOption(nameArray, dataArray);
    //   });
    // },
    // // //模块柱状
    // setBarOptions(nameArray, dataArray) {
    //   this.barDatas = {
    //     nameArray,
    //     dataArray,
    //     // textTitle: "",
    //   };
    // },
    // //业务类型柱状
    // setBarOption(nameArray, dataArray) {
    //   this.barData = {
    //     nameArray,
    //     dataArray,
    //     // textTitle: "",
    //   };
    // },

    /** 详细按钮操作 */
    handleDetail(row) {
      this.open = true;
      this.form = { ...row };
    }
  }
};
</script>
<style lang="scss" scoped>
.textarea {
  width: 100%;
  /deep/ .inputShow {
    width: 100%;
  }
  /deep/ .el-form-item__content {
    width: 100%;
  }
}
</style>
