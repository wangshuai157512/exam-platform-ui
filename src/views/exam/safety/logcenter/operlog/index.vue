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
            v-for="status in typeOptions"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.type"
          placeholder="日志类型"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="status in typeList"
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
        <!-- <el-select
          v-model="queryShows.level"
          placeholder="操作模块"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="dict in dictOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select> -->
        <el-cascader
          size="small"
          v-model="level"
          :options="dictOptions"
          :props="props"
          clearable
        ></el-cascader>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="dateRange"
          style="width: 220px !important"
          size="small"
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
          v-hasPermi="['exam:safety:logcenter:operlog:chartQuery']"
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
      title="操作日志图表"
      :visible.sync="tubiaoopen"
      width="700px"
      append-to-body
    >
      <jaya-echar-bar v-if="barDatas" :getData="barDatas" />
      <jaya-echar-bar v-if="barData" :getData="barData" />
    </el-dialog>
    <!-- 详情 -->
    <el-dialog
      :close-on-click-modal="false"
      title="操作日志详情"
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
  loginlist,
  detailslist,
  typestatistics,
  operationstatistics,
  moduleList
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
      slotFn: (item, index) => `${item.businessType}%`,
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
          auth: ["exam:safety:logcenter:operlog:detail"]
        }
      ]
    }
  ];
};
export default {
  name: "Operlog",
  data() {
    return {
      column: column.call(this),
      // 遮罩层
      loading: true,
      //图表
      barData: null,
      barDatas: null,
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
      // 是否显示弹出层
      open: false,
      tubiaoopen: false,
      //系统模块
      titleoption: [],
      value: [],
      dictOptions: [],
      //操作模块
      operationli: [],
      tableData: [],
      //列表
      tableList: [],
      // 类型数据字典
      typeOptions: [
        { value: 1, label: "新增" },
        { value: 2, label: "修改" },
        { value: 3, label: "删除" },
        { value: 4, label: "查询" },
        { value: 0, label: "其他" }
      ],
      // 类型数据字典
      statusOptions: [
        { value: 0, label: "正常" },
        { value: 1, label: "异常" }
      ],
      // 日志类型
      typeList: [
        { value: 0, label: "其他" },
        { value: 1, label: "软件用户" },
        { value: 2, label: "访问参数" },
        { value: 3, label: "车辆参数" },
        { value: 4, label: "模型参数" },
        { value: 5, label: "评判参数" }
      ],
      // 日期范围
      dateRange: [
        this.parseTime(new Date(), "{y}-{m}-{d}"),
        this.parseTime(new Date(), "{y}-{m}-{d}")
      ],
      // 默认排序
      defaultSort: { prop: "operTime", order: "descending" },
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        title: undefined,
        businessType: "",
        status: "",
        ip: ""
      },
      level: [],
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level, value } = node;
          moduleList({
            level: level == 0 ? 1 : undefined,
            parentId: value
          }).then((res) => {
            const { data } = res;
            Promise.all(
              data.map((item) => {
                const { label, value } = item;
                return new Promise(function (resolve, reject) {
                  moduleList({ parentId: item.value }).then((res) => {
                    resolve({
                      value,
                      label,
                      leaf: res.data.length ? false : true
                    });
                  });
                });
              })
            ).then(resolve);
          });
        }
      }
    };
  },

  mounted() {
    this.getTableList();
  },

  methods: {
    /** 查询列表 */
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      this.loading = true;
      [this.queryParams.item1, this.queryParams.item2, this.queryParams.item3] =
        [this.level[0], this.level[1], this.level[2]];
      loginlist({
        ...this.queryParams,
        timeStart: this.dateRange ? this.dateRange[0] : "",
        timeEnd: this.dateRange ? this.dateRange[1] : ""
      }).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    //操作模块下拉查询
    mkSelectView() {
      moduleList().then((res) => {
        this.dictOptions = res.data;
        this.getTableList();
      });
    },
    //图表
    chartQuery() {
      this.tubiaoopen = true;
      operationstatistics({
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
        this.setBarOptions(nameArray, dataArray);
      });

      typestatistics({
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

    /** 详细按钮操作 */
    handleDetail(row) {
      this.open = true;
      let { id } = row;
      detailslist({ id }).then((res) => {
        let data = res.data;
        const str = {
          jxxh: "驾校序号",
          kcxh: "考场序号",
          kcmc: "考场名称",
          kscc: "考试场次",
          kscx: "考试车型",
          ksy1: "考试员1",
          ksyy: "考试原因",
          lsh: "流水号",
          sfzmhm: "身份证明号码",
          sfzmmc: "身份证明名称",
          xb: "性别",
          xm: "姓名",
          ykrq: "预约日期",
          yycs: "预约次数",
          zkzmbh: "准考证明编号",
          deptId:"管理部门"
        };
        if (res.data && res.data.logInfo) {
          Object.keys(str).forEach((key) => {
            data.logInfo = data.logInfo.replace(key, str[key]);
          });
        }
        this.form = data;
      });
    }
  }
};
</script>
