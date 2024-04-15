<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh">
        <jaya-select v-model="queryParams.kcxh" type="K" />
      </el-form-item>
      <el-form-item prop="jxxh">
        <jaya-select v-model="queryParams.jxxh" type="L" />
      </el-form-item>
      <!-- <el-form-item prop="kczt">
        <jaya-select
          placeholder="上传状态"
          @getOptions="getOptions"
          othername="exam_room_status"
          v-model="queryParams.kczt"
        />
      </el-form-item>
      <el-form-item prop="kczt">
        <jaya-select
          placeholder="评判类型"
          @getOptions="getOptions"
          othername="exam_room_status"
          v-model="queryParams.kczt"
        />
      </el-form-item> -->
      <el-form-item prop="kchp">
        <el-input
          size="small"
          v-model="queryParams.kchp"
          placeholder="考车号牌"
        ></el-input>
      </el-form-item>
      <el-form-item prop="xm">
        <el-input
          size="small"
          v-model="queryParams.xm"
          placeholder="姓名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="sfzmhm">
        <el-input
          style="width: 180px"
          size="small"
          v-model="queryParams.sfzmhm"
          placeholder="身份证号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="ksrq">
        <el-date-picker
          class="daterange"
          value-format="yyyy-MM-dd"
          size="small"
          v-model="ksrq"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="pplx">
        <el-select
          placeholder="评判类型"
          v-model="queryParams.pplx"
          size="small"
        >
          <el-option
            v-for="(option, index) in [
              { value: '0', label: '平台评判' },
              { value: '1', label: '车载评判' }
            ]"
            :key="index"
            :label="option.label"
            :value="option.value"
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
      <!-- <el-form-item class="fun-btn-right" prop="">
        <el-button
          @click="handleNewAdd"
          icon="el-icon-plus"
          size="small"
          type="primary"
          v-hasPermi="['exam:judge:add']"
          >添加</el-button
        >
      </el-form-item> -->
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
        :disabled="!isNew"
        class="dialogForm"
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
      >
        <el-form-item v-if="!isNew" label="考车号牌" prop="kchp">
          <el-input v-model="form.kchp" size="small" />
        </el-form-item>
        <el-form-item v-if="!isNew" label="扣分项目" prop="kfxm">
          <el-input v-model="form.kfxm" size="small" />
        </el-form-item>
        <el-form-item v-if="!isNew" label="扣分值" prop="kfz">
          <el-input v-model="form.kfz" size="small" />
        </el-form-item>
        <el-form-item v-if="!isNew" label="考试次数" prop="kscs">
          <el-input v-model="form.kscs" size="small" />
        </el-form-item>
        <el-form-item v-if="!isNew" label="流水号" prop="lsh">
          <el-input v-model="form.lsh" size="small" />
        </el-form-item>
        <el-form-item v-if="!isNew" label="评判类型" prop="pplx">
          <el-input v-model="form.ksxh" size="small" />
        </el-form-item>
        <el-form-item v-if="!isNew" label="操作人" prop="czr">
          <el-input v-model="form.czr" size="small" />
        </el-form-item>
        <el-form-item v-if="isNew" label="考分代码" prop="kfdm">
          <el-input
            v-model="form.kfdm"
            placeholder="请输考分代码"
            size="small"
          />
        </el-form-item>
        <el-form-item v-if="isNew" label="考试序号" prop="ksxh">
          <el-input
            v-model="form.ksxh"
            placeholder="请输考试序号"
            size="small"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const column = function () {
  return [
    {
      title: "序号",
      slotFn: (item, index) => index + 1,
      width: "80"
    },
    {
      title: "姓名",
      width: "150",
      prop: "xm"
    },
    {
      title: "考车编号",
      width: "150",
      prop: "kcbh"
    },
    {
      title: "考车号牌",
      width: "150",
      prop: "kchp"
    },
    {
      title: "考试员",
      width: "120",
      prop: "ksy1"
    },
    {
      title: "扣分代码",
      prop: "kfxm"
    },
    {
      title: "扣分内容",
      prop: "kfxm"
    },
    {
      title: "扣分值",
      width: "80",
      prop: "kfz"
    },
    {
      title: "扣分时间",
      width: "80",
      prop: "kfsj"
    },
    {
      title: "身份证号",
      width: "180",
      prop: "sfzmhm"
    },
    {
      title: "流水号",
      width: "150",
      prop: "lsh"
    },
    {
      title: "考试科目",
      width: "80",
      prop: "kskm",
      status: () => "course"
    },
    {
      title: "考试日期",
      width: "150",
      prop: "ksrq",
      slotFn: (item) => item.ksrq?.split(" ")[0]
    },
    {
      title: "考试原因",
      prop: "ksyy",
      status: () => "exam_reason_type"
    },
    {
      title: "上传状态",
      prop: "sczt",
      width: "80",
      status: () => this.scztOptions
    },
    {
      title: "扣分类型",
      prop: "pplx",
      width: "150",
      status: () => [
        { value: "0", label: "平台考官评判" },
        { value: "1", label: "车载申请评判" }
      ]
    },
    {
      title: "驾校简称",
      width: "150",
      prop: "jxjc"
    },
    // {
    //   title: "审核状态",
    //   prop: "shzt",
    //   width: "150",
    //   status: () => [{ value: "1", label: "未审核" }],
    // },
    {
      title: "操作人",
      prop: "czrxm",
      width: "90"
    }
    // {
    //   title: "操作",
    //   width: "150",
    //   type: "buttons",
    //   prop: "roleId",
    //   butList: [
    //     {
    //       title: "审核",
    //       size: "mini",
    //       disabled: false,
    //       condition: "1",
    //       hide: ({ shzt }) => shzt != "1",
    //       onClick: this.handleAuditExam,
    //     },
    //     {
    //       title: "无需审核",
    //       size: "mini",
    //       disabled: true,
    //       hide: ({ shzt }) => shzt == "1",
    //     },
    //   ],
    // },
  ];
};
import {
  getDrvExamJudgePageList,
  getDrvExamJudgeInfo,
  getDrvExamJudgeAuditExam,
  getDrvExamJudgeAdd
} from "@/api/exam/judge";
export default {
  name: "judge",
  data() {
    return {
      total: 0,
      title: "新增",
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      ksrq: [
        this.parseTime(new Date(), "{y}-{m}-{d}"),
        this.parseTime(new Date(), "{y}-{m}-{d}")
      ],
      tableList: [],
      scztOptions: [
        { value: "0", label: "未上传" },
        { value: "1", label: "已上传" },
        { value: "2", label: "上传失败" }
      ],
      visible: false,
      form: {},
      isNew: true,
      rules: {
        kfdm: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ],
        ksxh: [
          {
            required: true,
            message: "必填项",
            trigger: "change"
          }
        ]
      }
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
      getDrvExamJudgePageList({
        ...this.queryParams,
        startDate: this.ksrq ? this.ksrq[0] : "",
        endDate: this.ksrq ? this.ksrq[1] : ""
      }).then((res) => {
        this.tableList = res.rows.map((item) => {
          item.kfxm = `${item.kfxm},${item.kfsm}`;
          return item;
        });
        this.total = res.total;
      });
    },
    handleNewAdd() {
      this.visible = true;
      this.isNew = true;
      this.resetForm("form");
    },
    handleSure() {
      if (this.isNew) {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            getDrvExamJudgeAdd(this.form).then((res) => {
              this.visible = false;
              this.msgSuccess("新增成功");
            });
          }
        });
      } else {
        this.visible = false;
      }
    },
    handleAuditExam({ id }) {
      getDrvExamJudgeAuditExam({ id }).then((res) => {
        this.msgSuccess(res.msg);
        this.getTableList();
      });
    }
  }
};
</script>
<style scoped>
.daterange {
  width: 240px !important;
}
</style>
