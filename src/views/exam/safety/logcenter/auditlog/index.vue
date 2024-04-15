<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item prop="ip">
        <el-input
          v-model="queryParams.ip"
          placeholder="主机IP地址"
          clearable
          style="width: 150px"
          size="small"
        />
      </el-form-item>

      <el-form-item prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="业务类型"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
        <el-button
          type="primary"
          icon="el-icon-data-line"
          size="small"
          @click="chartQuery"
          v-hasPermi="['exam:safety:logcenter:auditlog:chartQuery']"
          >显示图表</el-button
        >
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
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

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->
    <!--显示图表 -->
    <el-dialog
      :close-on-click-modal="false"
      title="审计日志图表"
      :visible.sync="tubiaoopen"
      width="700px"
      append-to-body
    >
      <div><jaya-echar-bar v-if="typeData" :getData="typeData" /></div>
      <div><jaya-echar-bar v-if="barData" :getData="barData" /></div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      :close-on-click-modal="false"
      title="审计日志详情"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form
        class="dialogForm"
        :inline="true"
        ref="form"
        :model="form"
        label-width="100px"
        size="mini"
        :disabled="true"
      >
        <el-form-item label="一级模块名称" prop="item1Name">
          <el-input v-model="form.item1Name" size="small" />
        </el-form-item>
        <el-form-item label="二级模块名称" prop="item2Name">
          <el-input v-model="form.item2Name" size="small" />
        </el-form-item>
        <el-form-item label="三级模块名称" prop="item3Name">
          <el-input v-model="form.item3Name" size="small" />
        </el-form-item>
        <el-form-item label="主机ip地址" prop="ip">
          <el-input v-model="form.ip" size="small" />
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType">
          <el-select
            v-model="form.businessType"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间" prop="createTime">
          <el-input v-model="form.createTime" size="small" />
        </el-form-item>

        <el-form-item label="用户真实姓名" prop="realName">
          <el-input v-model="form.realName" size="small" />
        </el-form-item>

        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" size="small" />
        </el-form-item>
        <el-form-item label="单位名称(部门)" prop="unitName">
          <el-input v-model="form.unitName" size="small" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择" size="small">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="mac地址" prop="mac">
          <el-input v-model="form.mac" size="small" />
        </el-form-item>
        <el-form-item label="日志明细" prop="logInfo">
          <el-input
            style="width: 602px"
            type="textarea"
            rows="5"
            v-model="form.logInfo"
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
  auditlogList,
  auditlogInfo,
  auditTypeChart,
  auditOperationChart
} from "@/api/exam/safety/logcenter";
const column = function () {
  return [
    { title: "操作时间", prop: "createTime", width: "200" },
    {
      title: "用户名称",
      prop: "userName"
    },
    {
      title: "用户真实姓名",
      prop: "realName"
    },
    {
      title: "单位名称(部门)",
      prop: "unitName"
    },
    {
      title: "日志明细",
      prop: "logInfo",
      width: "280"
    },

    {
      title: "一级模块名称",
      prop: "item1Name"
    },
    {
      title: "二级模块名称",
      prop: "item2Name"
    },
    {
      title: "三级模块名称",
      prop: "item3Name"
    },
    {
      title: "主机ip地址",
      prop: "ip"
    },
    {
      title: "mac地址",
      prop: "mac"
    },
    {
      title: "业务类型",
      prop: "businessType",
      status: () => this.typeOptions
    },
    // {
    //   title: "日志明细",
    //   prop: "logInfo",
    // },
    {
      title: "状态",
      prop: "status",
      status: () => this.statusOptions
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
          auth: ["exam:safety:logcenter:auditlog:detail"]
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
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      //图表
      barData: null,
      typeData: null,
      // 是否显示弹出层
      open: false,
      tubiaoopen: false,
      //系统
      tableList: [],
      form: {},
      // 类型数据字典
      typeOptions: [
        { value: 0, label: "其他" },
        { value: 1, label: "新增" },
        { value: 2, label: "修改" },
        { value: 3, label: "删除" },
        { value: 4, label: "查询" }
      ],
      // 类型数据字典
      statusOptions: [
        { value: 0, label: "正常" },
        { value: 1, label: "异常" }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        ip: "",
        businessType: "",
        status: ""
      },
      //日期
      dateRange: [
        this.parseTime(new Date(), "{y}-{m}-{d}"),
        this.parseTime(new Date(), "{y}-{m}-{d}")
      ]
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    /** 查询登录日志列表 */
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      this.loading = true;
      auditlogList({
        ...this.queryParams,
        timeStart: this.dateRange ? this.dateRange[0] : "",
        timeEnd: this.dateRange ? this.dateRange[1] : ""
      }).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    //图表
    chartQuery() {
      this.tubiaoopen = true;
      auditOperationChart({
        ...this.queryParams,
        timeStart: this.dateRange ? this.dateRange[0] : "",
        timeEnd: this.dateRange ? this.dateRange[1] : ""
      }).then((res) => {
        // this.tableList = res.data;
        const nameArray = [];
        const dataArray = [];
        res.data.forEach((item) => {
          nameArray.push(item.name);
          dataArray.push(Number(item.total));
        });
        this.setBarOption(nameArray, dataArray);
      });

      auditTypeChart({
        ...this.queryParams,
        timeStart: this.dateRange ? this.dateRange[0] : "",
        timeEnd: this.dateRange ? this.dateRange[1] : ""
      }).then((res) => {
        // this.tableList = res.data;
        // this.total = res.total;
        const nameArray = [];
        const dataArray = [];
        res.data.forEach((item) => {
          nameArray.push(item.name);
          dataArray.push(Number(item.total));
        });
        this.typeColumnar(nameArray, dataArray);
      });
    },

    //业务类型柱状
    setBarOption(nameArray, dataArray) {
      this.barData = {
        nameArray,
        dataArray
        // textTitle: "",
      };
    },
    //模块柱状
    typeColumnar(nameArray, dataArray) {
      this.typeData = {
        nameArray,
        dataArray
        // textTitle: "",
      };
    },
    /** 详细按钮操作 */
    handleDetail(row) {
      this.open = true;
      let { id } = row;
      auditlogInfo({ id }).then((res) => {
        // res.row.forEach(item => {
        //     if(item.status === 0) {
        //       item.status = "正常"
        //     }else if(item.status === 1) {
        //       item.status = "异常"
        //     }
        //   });
        this.form = res.data;
      });
    }
  }
};
</script>
