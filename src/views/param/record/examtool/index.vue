<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh">
        <jaya-select v-model="queryParams.kcxh" type="K" />
      </el-form-item>
      <el-form-item prop="syzt">
        <jaya-select
          v-model="queryParams.syzt"
          placeholder="使用状态"
          @getOptions="getOptions"
          othername="equipment_use_status"
        />
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
          v-hasPermi="['record:examtool:add']"
          icon="el-icon-plus"
          size="small"
          type="primary"
          >添加</el-button
        >
        <el-button
          @click="handleDownload"
          icon="el-icon-download"
          size="small"
          type="primary"
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
        :disabled="operating == 3"
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
      >
        <el-form-item label="考场简称" prop="kcxh">
          <jaya-select style="width: 194px" v-model="form.kcxh" type="K" />
        </el-form-item>
        <el-form-item label="设备序号" prop="kssbxh">
          <el-input
            :disabled="operating == 2"
            v-model="form.kssbxh"
            placeholder="请输入设备序号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="设备编号" prop="sbbh">
          <el-input
            :disabled="operating == 2"
            v-model="form.sbbh"
            placeholder="请输入设备编号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="设备名称" prop="sbmc">
          <el-input
            v-model="form.sbmc"
            placeholder="请输入设备名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="制造厂商" prop="zzcs">
          <el-input
            v-model="form.zzcs"
            placeholder="请输入制造厂商"
            size="small"
          />
        </el-form-item>
        <el-form-item label="设备型号" prop="sbxh">
          <el-input
            v-model="form.sbxh"
            placeholder="请输入设备型号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考试项目" prop="ksxm">
          <jaya-select type="X" v-model="form.ksxm" />
        </el-form-item>
        <el-form-item label="考试项目说明" prop="ksxmsm">
          <el-input
            v-model="form.ksxmsm"
            placeholder="请输入考试项目说明"
            size="small"
          />
        </el-form-item>
        <el-form-item label="评判方式" prop="ppfs">
          <el-select
            clearable
            style="width: 194px"
            v-model="form.ppfs"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in judgeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目区域码" prop="xmqym">
          <el-input
            v-model="form.xmqym"
            placeholder="请输入项目区域码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="红绿灯ID" prop="hldId">
          <el-input
            v-model="form.hldId"
            placeholder="请输入红绿灯ID"
            size="small"
          />
        </el-form-item>
        <el-form-item label="转向灯" prop="zxd">
          <jaya-select
            placeholder="转向灯"
            othername="turn_signal"
            v-model="form.zxd"
          />
        </el-form-item>
        <el-form-item label="准考车型" prop="syzjcx">
          <jaya-select
            sty="width:602px"
            multiple
            placeholder="准考车型"
            @getOptions="getOptions"
            othername="exam_car_type"
            v-model="form.syzjcx"
          />
        </el-form-item>
        <el-form-item label="验收日期" prop="ysrq">
          <el-date-picker
            size="small"
            value-format="yyyy-MM-dd"
            v-model="form.ysrq"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="时间/每次" prop="badckssj">
          <el-input
            v-model="form.badckssj"
            placeholder="请输入时间/每次"
            size="small"
          />
        </el-form-item>
        <el-form-item label="人/小时" prop="bamxsksr">
          <el-input
            v-model="form.bamxsksr"
            placeholder="请输入人/小时"
            size="small"
          />
        </el-form-item>
        <el-form-item label="有效期至" prop="jyyxqz">
          <el-date-picker
            size="small"
            value-format="yyyy-MM-dd"
            v-model="form.jyyxqz"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="使用状态" prop="syzt">
          <jaya-select
            placeholder="使用状态"
            @getOptions="getOptions"
            othername="equipment_use_status"
            v-model="form.syzt"
          />
        </el-form-item>
        <el-form-item v-if="operating == 3" label="创建时间" prop="cjsj">
          <el-date-picker
            value-format="yyyy-MM-dd"
            :disabled="true"
            type="date"
            size="small"
            v-model="form.cjsj"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item v-if="operating == 3" label="更新日期" prop="gxsj">
          <el-date-picker
            size="small"
            :disabled="true"
            value-format="yyyy-MM-dd"
            v-model="form.gxsj"
            type="date"
            placeholder="选择日期"
          />
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
  examToolPageList,
  examToolNewAdd,
  examToolDown,
  examToolInfo,
  examToolUpdate
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
      title: "设备序号",
      width: "100",
      prop: "kssbxh"
    },
    {
      title: "设备编号",
      width: "150",
      prop: "sbbh"
    },
    {
      title: "设备名称",
      width: "150",
      prop: "sbmc"
    },
    {
      title: "考试项目",
      width: "100",
      prop: "ksxm",
      status: () => "X"
    },
    {
      title: "评判方式",
      width: "140",
      prop: "ppfs",
      status: () => this.judgeOption
    },
    {
      title: "适用车型",
      width: "200",
      prop: "syzjcx"
    },
    {
      title: "制造厂商",
      prop: "zzcs"
    },
    {
      title: "单次考试时间(分)",
      width: "130",
      prop: "badckssj"
    },
    {
      title: "每小时考试人数",
      width: "120",
      prop: "bamxsksr"
    },
    {
      title: "状态",
      width: "100",
      prop: "syzt",
      status: () => "equipment_use_status"
    },
    {
      title: "操作",
      width: "150",
      type: "buttons",
      prop: "roleId",
      butList: [
        {
          title: "详情",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleDetail,
          auth: ["record:examtool:detail"]
        },
        {
          title: "修改",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleUpdate,
          auth: ["record:examtool:edit"]
        }
      ]
    }
  ];
};
const name = {
  sbmc: "设备名称",
  zzcs: "制造厂商",
  sbxh: "设备型号",
  ksxm: "考试项目",
  ksxmsm: "考试项目说明",
  ppfs: "评判方式",
  xmqym: "项目区域码",
  hldId: "红绿灯ID",
  zxd: "转向灯",
  syzjcx: "准考车型",
  ysrq: "验收日期",
  badckssj: "时间/每次",
  bamxsksr: "人/小时",
  jyyxqz: "有效期至",
  syzt: "使用状态"
};
let beroreUpdate = {};
export default {
  name: "ExamTool",
  data() {
    return {
      total: 0,
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      judgeOption: [
        { value: "0", label: "计算机自动评判" },
        { value: "1", label: "人工评判" }
      ],
      rules: {
        kcxh: [{ required: true, trigger: "change", message: "必填项" }],
        xmqym: [
          {
            pattern: /^\d{1,8}$/,
            message: "请输入1~8位数字",
            trigger: "change"
          }
        ],
        kssbxh: [
          { required: true, trigger: "change", message: "必填项" },
          { pattern: /^\d{8}$/, message: "请输入8位数字" }
        ],
        ppfs: [{ required: true, trigger: "change", message: "必填项" }],
        sbbh: [{ required: true, trigger: "change", message: "必填项" }],
        sbmc: [{ required: true, trigger: "change", message: "必填项" }],
        zzcs: [{ required: true, trigger: "change", message: "必填项" }],
        ksxm: [{ required: true, trigger: "change", message: "必填项" }],
        ksxmsm: [{ required: true, trigger: "change", message: "必填项" }],
        syzjcx: [{ required: true, trigger: "change", message: "必填项" }],
        bamxsksr: [{ required: true, trigger: "change", message: "必填项" }],
        badckssj: [{ required: true, trigger: "change", message: "必填项" }],
        syzt: [{ required: true, trigger: "change", message: "必填项" }]
      },
      cartype: [],
      sujectOptions: [],
      equipment_use_status: [],
      course: [],
      form: {},
      visible: true,
      tableList: [],
      operating: 1, // 新增 1 修改2 详情 3
      title: "新增"
    };
  },
  created() {
    this.visible = false;
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    getOptions({ data, type }) {
      setTimeout(() => {
        this[type] = data;
      });
    },

    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      examToolPageList(this.queryParams).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
      });
    },

    getDetail({ kssbxh }) {
      examToolInfo({ id: kssbxh }).then((res) => {
        this.form = res.data;
        this.form.syzjcx = this.form.syzjcx.split(",");
        this.visible = true;
        beroreUpdate = Object.assign({}, this.form);
      });
    },

    // 新增
    handleAddVisible() {
      this.operating = 1;
      this.title = "新增";
      this.form = { syzjcx: [] };
      this.resetForm("form");
      this.visible = true;
    },

    // 详情
    handleDetail(row) {
      this.operating = 3;
      this.title = "详情";
      this.getDetail(row);
    },

    handleUpdate(row) {
      this.operating = 2;
      this.title = "修改";
      this.getDetail(row);
    },
    // 下载
    handleDownload() {
      if (!this.queryParams.kcxh) return this.msgWarn("请先选择考场");
      examToolDown({ kcxh: this.queryParams.kcxh }).then((res) => {
        this.msgSuccess(res.msg);
      });
    },

    handleSure() {
      this.visible = true;
      if (this.operating !== 3) {
        // 新增，修改 逻辑
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.operating == 1) {
              examToolNewAdd({
                ...this.form,
                syzjcx: this.form.syzjcx.join()
              }).then(() => {
                this.getTableList();
                this.msgSuccess("新增成功");
                this.visible = false;
              });
            } else {
              const {
                sbbh,
                kssbxh,
                kcxh,
                sbmc,
                zzcs,
                sbxh,
                syzjcx,
                bamxsksr,
                badckssj,
                ksxm,
                ysrq,
                ksxmsm,
                syzt,
                ppfs,
                jyyxqz,
                xmqym,
                hldId,
                zxd
              } = this.form;
              const form = {
                sbbh,
                kssbxh,
                kcxh,
                sbmc,
                zzcs,
                sbxh,
                syzjcx: syzjcx.join(),
                bamxsksr,
                badckssj,
                ksxm,
                ysrq,
                ksxmsm,
                syzt,
                ppfs,
                jyyxqz,
                xmqym,
                hldId,
                zxd
              };
              const log = this.diffLog(beroreUpdate, form, name);
              examToolUpdate({ ...form, log }).then(() => {
                this.getTableList();
                this.msgSuccess("修改成功");
                this.visible = false;
              });
            }
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
  /deep/ .el-select--small input {
    width: 100%;
  }

  .jaya-select {
    /deep/ .el-select {
      width: 194px;
    }
  }
}
</style>
