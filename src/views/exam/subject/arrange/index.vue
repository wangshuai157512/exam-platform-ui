<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <jaya-select type="K" v-model="queryParams.kcxh"></jaya-select>
      </el-form-item>
      <el-form-item prop="kccx">
        <jaya-select
          v-model="queryParams.kscxs"
          placeholder="考试车型"
          othername="exam_car_type"
          multiple
          sty="width:200px"
        >
        </jaya-select>
      </el-form-item>
      <el-form-item prop="ksxl">
        <el-select
          placeholder="考试线路"
          v-model="queryParams.ksxl"
          size="small"
          clearable
        >
          <el-option
            v-for="(option, index) in ksxlList"
            :key="index"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="xm">
        <el-input v-model="queryParams.xm" placeholder="姓名" size="small" />
      </el-form-item>
      <el-form-item prop="sfzmhm">
        <el-input
          v-model="queryParams.sfzmhm"
          placeholder="身份证号"
          size="small"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item prop="kcbh">
        <el-input
          v-model="queryParams.kcbh"
          placeholder="考车编号"
          size="small"
        />
      </el-form-item>
      <el-form-item prop="kszt">
        <el-select
          v-model="queryParams.kszt"
          placeholder="考试状态"
          size="small"
          clearable
        >
          <el-option
            v-for="item in ksztList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="dx">
        <el-checkbox v-model="queryParams.kcpx" false-label="0" true-label="1"
          >按考试车排序</el-checkbox
        >
        <el-checkbox v-model="refresh">自动刷新</el-checkbox>
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
    </el-form>
    <jaya-table-group
      :total="total"
      :tableHeaderList="column"
      :tableList="tableData"
      :row-class-fn="tableRowClassName"
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>
    <!-- 考生排考详情弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="考生排考详情"
      :visible.sync="open"
      width="680px"
      append-to-body
    >
      <el-form
        :model="form"
        ref="form"
        :inline="true"
        :disabled="isDetail"
        class="dialogForm"
      >
        <el-form-item label="流水号" prop="lsh">
          <el-input
            v-model="form.lsh"
            placeholder="请输入流水号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="form.xm" placeholder="请输入姓名" size="small" />
        </el-form-item>
        <el-form-item label="性别" prop="xb">
          <el-select v-model="form.xb" placeholder="请选择" size="small">
            <el-option
              v-for="item in xbList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="sfzmhm">
          <el-input
            v-model="form.sfzmhm"
            placeholder="请输入身份证号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="准考证明编号" prop="zkzmbh">
          <el-input
            v-model="form.zkzmbh"
            placeholder="请输入准考证明编号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考试日期" prop="ksrq">
          <el-date-picker
            v-model="form.ksrq"
            size="small"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="考试日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="准驾车型" prop="kscx">
          <jaya-select v-model="form.kscx" othername="exam_car_type">
          </jaya-select>
        </el-form-item>
        <el-form-item label="所属考场" prop="kcxh">
          <jaya-select type="K" v-model="form.kcxh" />
        </el-form-item>
        <el-form-item label="报考次数" prop="bkcs">
          <el-select v-model="form.bkcs" placeholder="请选择" size="small">
            <el-option
              v-for="item in bcyykscsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试原因" prop="ksyy">
          <jaya-select v-model="form.ksyy" othername="exam_reason_type">
          </jaya-select>
        </el-form-item>
        <el-form-item label="培训驾校" prop="jxxh">
          <el-select v-model="form.jxxh" placeholder="请选择" size="small">
            <el-option
              v-for="item in jxxhList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试员1" prop="ksy1">
          <jaya-select type="S" v-model="form.ksy1" />
        </el-form-item>
        <el-form-item label="考试员2" prop="ksy2">
          <jaya-select type="S" v-model="form.ksy2" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="考试原因修改"
      :visible.sync="examOpen"
      width="450px"
      append-to-body
    >
      <el-form
        :model="updateExam"
        ref="examForm"
        :inline="true"
        class="dialogForm"
      >
        <el-form-item label="考生姓名">
          <el-input
            :disabled="true"
            v-model="updateExam.xm"
            placeholder="考生姓名"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考试车型">
          <el-input
            :disabled="true"
            v-model="updateExam.kscx"
            placeholder="考试车型"
            size="small"
          />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input
            :disabled="true"
            v-model="updateExam.sfzmhm"
            placeholder="身份证号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="驾校简称">
          <el-input
            :disabled="true"
            v-model="updateExam.jxjc"
            placeholder="驾校简称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考车号牌">
          <el-input
            :disabled="true"
            v-model="updateExam.kchp"
            placeholder="考车号牌"
            size="small"
          />
        </el-form-item>
        <el-form-item label="流水号">
          <el-input
            :disabled="true"
            v-model="updateExam.lsh"
            placeholder="流水号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="车辆品牌">
          <el-input
            :disabled="true"
            v-model="updateExam.clpp"
            placeholder="车辆品牌"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考试原因" prop="ksyy">
          <jaya-select
            v-model="updateExam.ksyy"
            placeholder="考试原因"
            othername="exam_reason_type"
          >
          </jaya-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="examOpen = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateExam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  drvSchool,
  arrangeList,
  arrangePause,
  arrangeRecover,
  arrangeStop,
  arrangeCancel,
  arrangeDetail,
  setExamCause,
} from "@/api/exam/examSubject";
import { getLineSelect } from "@/api/param/select";
const column = function () {
  return [
    {
      title: "序号",
      width: "50",
      slotFn: (item, index) => index + 1,
    },
    {
      title: "姓名",
      prop: "xm",
    },
    {
      title: "考车编号",
      prop: "kcbh",
      width: "80",
    },
    {
      title: "考车号牌",
      prop: "kchp",
    },

    {
      title: "预约次数",
      prop: "yycs",
      width: "80",
    },
    {
      title: "考试原因",
      prop: "ksyy",
      status: () => "exam_reason_type",
    },
    {
      title: "身份证号",
      prop: "sfzmhm",
      width: "200",
    },
    {
      title: "考试状态",
      prop: "kszt",
    },
    {
      title: "考试车型",
      prop: "kscx",
      status: () => {
        return "exam_car_type";
      },
      width: "80",
    },
    {
      title: "考试员1",
      prop: "ksy1",
    },

    {
      title: "考场简称",
      prop: "kcjc",
    },

    {
      title: "流水号",
      prop: "lsh",
    },
    {
      title: "车辆品牌",
      prop: "clpp",
    },
    {
      title: "考试线路",
      prop: "xlh",
      slotFn: (row) => {
        if (row.kskm !== "3") {
          return "-";
        }
      },
    },
    {
      title: "考试员2",
      prop: "ksy2",
    },
    {
      title: "驾校简称",
      prop: "jxjc",
      width: "200",
    },
    {
      title: "操作",
      width: "320",
      type: "buttons",
      butList: [
        {
          title: "暂停",
          size: "mini",
          hide: (row) => {
            return row.kszt !== "考试中";
          },
          onClick: this.handlePause,
          auth: ["exam:subject:arrange:pause"],
        },
        {
          title: "恢复",
          size: "mini",
          hide: (row) => {
            return row.kszt !== "暂停考试";
          },
          onClick: this.handleRecover,
          auth: ["exam:subject:arrange:recover"],
        },
        // {
        //   title: "停止考试",
        //   size: "mini",
        //   formatter: (row) => {
        //     return row.row.kszt !== "考试中";
        //   },
        //   onClick: this.handleStop,
        //   auth:['exam:subject:arrange:stop']
        // },
        {
          title: "取消",
          size: "mini",
          hide: (row) => {
            return row.kszt === "取消考试";
          },
          onClick: this.handleCancel,
          auth: ["exam:subject:arrange:cancel"],
        },
        {
          title: "设置考试原因",
          size: "mini",
          onClick: (row) => {
            this.examOpen = true;
            this.updateExam = { ...row, ksrq: row.ksrq.split(" ")[0] };
          },
          auth: ["exam:subject:arrange:cause"],
        },
        {
          title: "详情",
          size: "mini",
          onClick: this.handleDetail,
          auth: ["exam:subject:arrange:detail"],
        },
      ],
    },
  ];
};
export default {
  name: "arrange",
  data() {
    return {
      total: 0,
      column: column.call(this),
      examOpen: false,
      updateExam: {},
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        // kcxh: '',
        kscxs: "",
        // xm: "",
        // sfzmhm:"",
        // kcbh:"",
        // kszt:"",
      },
      ksxlList: [],
      refresh: false,
      tableData: [],
      kccxList: [],
      ksztList: [
        {
          label: "等待考试",
          value: "1",
        },
        {
          label: "立即上车",
          value: "2",
        },
        {
          label: "视频认证",
          value: "3",
        },
        {
          label: "考试中",
          value: "4",
        },
        {
          label: "考试结束",
          value: "6",
        },
        {
          label: "暂停考试",
          value: "7",
        },
        {
          label: "取消考试",
          value: "9",
        },
        {
          label: "异常重考",
          value: "11",
        },
        {
          label: "终止考试",
          value: "12",
        },
      ],
      form: {},
      bcyykscsList: [
        {
          label: "1",
          value: "1",
        },
        {
          label: "2",
          value: "2",
        },
      ],
      jxxhList: [],
      xbList: [
        {
          label: "男",
          value: "1",
        },
        {
          label: "女",
          value: "2",
        },
      ],
      open: false,
      isDetail: false,
    };
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.kszt == "立即上车") {
        return "comecar";
      } else if (row.kszt == "考试中") {
        return "examining";
      } else {
        return "";
      }
    },
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      let queryVehicles = this.queryParams.kscxs + "";
      if (this.queryParams.kcpx == "1") {
        arrangeList({
          ...this.queryParams,
          kscxs: queryVehicles,
          asc: "kcbh",
        }).then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        });
      } else {
        arrangeList({ ...this.queryParams, kscxs: queryVehicles }).then(
          (res) => {
            this.tableData = res.rows;
            this.total = res.total;
          }
        );
      }
    },
    // 暂停
    handlePause(row) {
      let { kskm, lsh } = row;
      this.$confirm(`确认暂停${row.xm},${row.sfzmhm}考试吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        arrangePause({ kskm, lsh }).then((res) => {
          this.$message({
            message: `${row.xm},${row.sfzmhm}已暂停考试`,
            type: "success",
          });
          this.getTableList();
        });
      });
    },
    //恢复考试
    handleRecover(row) {
      let { kskm, lsh } = row;
      this.$confirm(`确认恢复${row.xm},${row.sfzmhm}考试吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        arrangeRecover({ kskm, lsh }).then((res) => {
          this.$message({
            message: `${row.xm},${row.sfzmhm}已恢复考试`,
            type: "success",
          });
          this.getTableList();
        });
      });
    },
    // 停止考试
    handleStop(row) {
      let { kskm, lsh } = row;
      this.$confirm(`确认停止${row.xm},${row.sfzmhm}考试吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        arrangeStop({ kskm, lsh }).then((res) => {
          this.$message({
            message: `${row.xm},${row.sfzmhm}已停止考试`,
            type: "success",
          });
          this.getTableList();
        });
      });
    },
    // 取消考试
    handleCancel(row) {
      let { kskm, lsh } = row;
      this.$confirm(`确认取消${row.xm},${row.sfzmhm}考试吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        arrangeCancel({ kskm, lsh }).then((res) => {
          this.$message({
            message: `${row.xm},${row.sfzmhm}已取消考试`,
            type: "success",
          });
          this.getTableList();
        });
      });
    },
    //详情
    handleDetail(row) {
      this.open = true;
      this.isDetail = true;
      let { kskm, lsh } = row;
      arrangeDetail({ kskm, lsh }).then((res) => {
        if (res.data) {
          this.form = res.data;
        }
      });
    },
    // 自动刷新
    refreshStatus() {
      if (this.refresh) {
        this.timer = setInterval(() => {
          this.getTableList();
        }, 5000);
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    handleUpdateExam() {
      this.examOpen = true;
      if (!this.updateExam.ksyy) {
        return this.msgWarn("请填写考试原因");
      }
      const { lsh, kskm, ksrq, ksyy } = this.updateExam;
      setExamCause({ lsh, kskm, ksrq, ksyy }).then((res) => {
        this.examOpen = false;
        if (res.code == 200) {
          this.msgSuccess(res.msg);
        }
      });
    },
  },
  mounted() {
    drvSchool().then((res) => {
      this.jxxhList = res.data;
    });
    getLineSelect().then(({ data }) => {
      this.ksxlList = data;
    });
    this.getTableList();
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  watch: {
    refresh: {
      handler: "refreshStatus",
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
/deep/.comecar {
  color: red;
}
/deep/.examining {
  color: green;
}
</style>
