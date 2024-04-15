<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <!-- <el-form-item  prop="czfl">
        <el-select
          v-model="queryParams.czfl"
          placeholder="操作分类"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="dict in optionczfl"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
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
            v-for="status in typeOptions"
            :key="status.value"
            :label="status.label"
            :value="status.value"
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
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
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
          v-hasPermi="['exam:safety:logcenter:safelog:chartQuery']"
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
    <!--显示图表 -->
    <el-dialog
      :close-on-click-modal="false"
      title="安全日志图表"
      :visible.sync="tubiaoopen"
      width="700px"
      append-to-body
    >
      <jaya-echar-bar v-if="barDatas" :getData="barDatas" />
      <jaya-echar-bar v-if="barData" :getData="barData" />
    </el-dialog>
    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->
    <!-- 详细 -->
    <el-dialog
      :close-on-click-modal="false"
      title="安全日志详情"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form
        class="dialogForm"
        :inline="true"
        ref="form"
        :model="form"
        label-width="220px"
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
        <el-form-item label="校验位" prop="jyw">
          <!-- <el-input v-model="form.jyw" size="small" /> -->
          <el-input
            style="width: 890px"
            type="textarea"
            rows="5"
            v-model="form.jyw"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="日志明细" prop="logInfo">
          <!-- <el-input v-model="form.logInfo" size="small" /> -->
          <el-input
            style="width: 890px"
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
  securitylist,
  safetydetailslist,
  securitytype,
  safeoperation
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
      title: "计算机IP",
      prop: "ip"
    },
    {
      title: "计算机MAC",
      prop: "mac"
    },
    {
      title: "业务类型",
      prop: "businessType",
      status: () => this.typeOptions,
      slotFn: (item, index) => `${item.businessType}%`
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
          auth: ["exam:safety:logcenter:safelog:detail"]
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
      // 日期范围
      dateRange: [
        this.parseTime(new Date(), "{y}-{m}-{d}"),
        this.parseTime(new Date(), "{y}-{m}-{d}")
      ],
      // 是否显示弹出层
      open: false,
      barData: null,
      barDatas: null,
      tubiaoopen: false,
      //系统
      optionRZFL: [],
      optionczfl: [],
      optionczlx: [],
      tableList: [],
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
      form: {},
      // 默认排序
      defaultSort: { prop: "loginTime", order: "descending" },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        businessType: "",
        status: ""
      }
    };
  },
  mounted() {
    this.getTableList();
  },

  methods: {
    //图表
    chartQuery() {
      this.tubiaoopen = true;
      safeoperation({
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
        this.setBarOptions(nameArray, dataArray);
      });

      securitytype({
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
    },
    // //模块柱状
    setBarOptions(nameArray, dataArray) {
      this.barDatas = {
        nameArray,
        dataArray
        // textTitle: "",
      };
    },
    //业务类型柱状
    setBarOption(nameArray, dataArray) {
      this.barData = {
        nameArray,
        dataArray
        // textTitle: "",
      };
    },

    /** 查询列表 */
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      this.loading = true;
      securitylist({
        ...this.queryParams,
        timeStart: this.dateRange ? this.dateRange[0] : "",
        timeEnd: this.dateRange ? this.dateRange[1] : ""
      }).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    /** 详细按钮操作 */
    handleDetail(row) {
      this.open = true;
      let { id } = row;
      safetydetailslist({ id }).then((res) => {
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
