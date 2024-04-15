<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <!-- <el-form-item>
        <el-select
          v-model="queryParams.kskm"
          placeholder="考试科目"
          size="small"
        >
          <el-option
            v-for="item in kskmList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
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
      <el-form-item>
        <el-select
          v-model="queryParams.ksjg"
          placeholder="考试结果"
          size="small"
        >
          <el-option
            v-for="item in hgbjList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.qzzt"
          placeholder="签字状态"
          size="small"
        >
          <el-option
            v-for="item in qzztList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="queryParams.ksrq"
          size="small"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="考试日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryParams.lsh" placeholder="流水号" size="small" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryParams.xm" placeholder="姓名" size="small" />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.sfzmhm"
          placeholder="身份证号"
          size="small"
          style="width: 200px"
        />
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
      <el-form-item class="fun-btn-right">
        <el-button
          type="primary"
          icon="el-icon-s-claim"
          size="small"
          @click="batchSignature"
          v-hasPermi="['exam:subject:signature:batchSignature']"
          >批量签字</el-button
        >
      </el-form-item>
    </el-form>
    <jaya-table-group
      :total="total"
      :option="option"
      @handleSelectionChange="handleSelectionChange"
      :tableHeaderList="column"
      :tableList="tableData"
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>
    <!-- 考官签名 -->
    <el-dialog
      :close-on-click-modal="false"
      title="考官签字"
      :visible.sync="zpDialog"
      width="680px"
      append-to-body
      disabled
      v-if="zpDialog"
    >
      <div class="zpDialog-img">
        <img :src="'data:image/jpeg;base64,' + querySign.signphoto" alt="" />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSignature">确 定</el-button>
        <el-button @click="zpDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="考官签字"
      :visible.sync="open"
      width="680px"
      append-to-body
      disabled
      v-if="open"
    >
      <div class="sign-title" v-show="isSignTitle">
        <div>
          考场简称 <span>{{ form.kcjc }}</span>
        </div>
        <div>
          考试科目
          <span>{{
            form.kskm === "2" ? "科目二" : form.kskm === "3" ? "科目三" : ""
          }}</span>
        </div>
        <div>
          姓名 <span>{{ form.xm }}</span>
        </div>
        <div>
          成绩 <span>{{ form.kscj }}</span>
        </div>
        <div>
          考试结果
          <span>{{
            form.hgbj === "1" ? "合格" : form.hgbj === "2" ? "不合格" : ""
          }}</span>
        </div>
      </div>
      <template>
        <object
          id="ZCPenSign"
          name="ZCPenSign"
          classid="clsid:AA873F7C-EDD9-4757-A15C-BEDC9D780320"
          width="100%"
          height="300"
        >
          <param name="BorderStyle" value="4" />
        </object>
      </template>
      <div class="sign-footer">若考试记录无误,请在签名版上签字</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSignature">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      title="考试成绩单"
      :visible.sync="tranScriptVisible"
    >
      <div style="height: 1016px">
        <iframe
          style="width: 100%; height: 100%"
          :src="iframeSrc"
          frameborder="0"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  signatureList,
  signaturePhoto,
  signatureGetKsySign
} from "@/api/exam/examSubject";
const column = function () {
  return [
    {
      title: "序号",
      width: "60",
      slotFn: (item, index) => index + 1
    },
    {
      title: "考场简称",
      prop: "kcjc"
    },
    {
      title: "考试科目",
      prop: "kskm",
      status: () => this.kskmList
    },
    {
      title: "流水号",
      prop: "lsh"
    },
    {
      title: "姓名",
      prop: "xm"
    },
    {
      title: "身份证号",
      prop: "sfzmhm",
      width: "200"
    },
    {
      title: "考试日期",
      prop: "ksrq"
    },
    {
      title: "考试原因",
      prop: "ksyy",
      status: () => "exam_reason_type"
    },
    {
      title: "成绩",
      prop: "kscj"
    },
    {
      title: "考试结果",
      prop: "hgbj",
      status: () => this.hgbjList
    },
    {
      title: "考试车型",
      prop: "kscx"
    },
    {
      title: "考车编号",
      prop: "kcbh"
    },
    // {
    //   title: "考车号牌",
    //   prop: "hphm",
    // },
    {
      title: "考车品牌",
      prop: "kcpb"
    },
    {
      title: "考试员1",
      prop: "ksy1"
    },
    {
      title: "考试员2",
      prop: "ksy2"
    },
    {
      title: "签字状态",
      prop: "qzzt",
      status: () => this.qzztList
    },
    {
      title: "考试次数",
      prop: "kscs"
    },
    {
      title: "预约次数",
      prop: "yycs"
    },
    {
      title: "操作",
      width: "150",
      type: "buttons",
      fixed: "right",
      butList: [
        {
          title: "签字",
          size: "mini",
          onClick: this.handleSignature,
          auth: ["exam:subject:signature:signature"]
        },
        {
          title: "成绩单",
          size: "mini",
          onClick: this.handleScore,
          auth: ["exam:subject:signature:score"]
        }
      ]
    }
  ];
};

export default {
  name: "signature",
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        kscxs: "",
        ksrq: this.parseTime(new Date(), "{y}-{m}-{d}")
      },
      kskmList: [
        {
          label: "科目二",
          value: "2"
        },
        {
          label: "科目三",
          value: "3"
        }
      ],
      column: column.call(this),
      option: { ismultiple: true },
      tableData: [],
      hgbjList: [
        {
          label: "合格",
          value: "1"
        },
        {
          label: "不合格",
          value: "2"
        }
      ],
      qzztList: [
        {
          label: "未签名",
          value: "0"
        },
        {
          label: "已签名",
          value: "1"
        }
      ],
      open: false,
      form: {},
      isSignTitle: false,
      roomNumber: [],
      ZCPenSignObj: null,
      zpDialog: false,
      querySign: {
        ksxhs: "",
        signphoto: "" //签名照片
      },
      tranScriptVisible: false,
      iframeSrc: ""
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      let queryVehicles = this.queryParams.kscxs + "";
      signatureList({ ...this.queryParams, kscxs: queryVehicles }).then(
        (res) => {
          this.tableData = res.rows;
        }
      );
    },
    // 多选
    handleSelectionChange(val) {
      this.roomNumber = val.map((item) => {
        return item.ksxh;
      });
      this.querySign.ksxhs = this.roomNumber + "";
    },

    //获取签名照片
    async getSignaturePhoto() {
      let { data } = await signatureGetKsySign();
      if (data) {
        this.querySign.signphoto = data.zp;
        this.zpDialog = true;
        return;
      }
    },

    // 批量签字
    batchSignature() {
      if (!this.querySign.ksxhs) {
        this.$message({
          message: "请至少选择一条考试数据",
          type: "warning"
        });
        return;
      }
      this.isSignTitle = false;
      this.handleSignature();
    },

    // 签字
    async handleSignature(row) {
      this.querySign.signphoto = "";
      if (row) {
        this.isSignTitle = true;
        this.form = row;
        this.querySign.ksxhs = row.ksxh + ",";
      }
      await this.getSignaturePhoto();
      if (this.querySign.signphoto) {
        return;
      }
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var isIE =
        userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
      if (!isIE) {
        this.$confirm("请使用IE浏览器进行签名", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
        return;
      }
      this.open = true;
      this.$nextTick(() => {
        this.ZCPenSignObj = document.getElementById("ZCPenSign");
        // 初始化设备
        setTimeout(() => {
          this.ZCPenSignObj.ZCInitialize();
          // 清除笔记
          this.ZCPenSignObj.ZCClearPenSign();
          // 监听确认签名
          this.ZCPenSignObj.attachEvent("ConfirmEvent", this.submitSignature);
        }, 500);
      });
    },
    // 提交签名
    submitSignature() {
      if (this.ZCPenSignObj.ZCGetBase64Stream(2).length <= 1816) {
        this.$message({
          message: "请先完成签名",
          type: "warning"
        });
        return;
      }
      this.querySign.signphoto = this.ZCPenSignObj.ZCGetBase64Stream(2);
      signaturePhoto(this.querySign).then((res) => {
        this.getTableList();
        this.$message({
          message: "签名完成",
          type: "success"
        });
        this.open = false;
      });
    },
    // 成绩单
    handleScore(row) {
      const { href } = this.$router.resolve({
        name: "TranScript"
      });
      this.iframeSrc = `${href}?${row.ksxh}`;
      this.tranScriptVisible = true;
    }
  },
  mounted() {
    this.getTableList();
  },
  watch: {
    open(val) {
      if (!val && this.isSignTitle) {
        this.querySign = {
          ksxhs: "",
          signphoto: "" //签名照片
        };
      }
      if (!val) {
        this.ZCPenSignObj.ZCFinalize();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog {
  .el-input,
  .el-select {
    width: 194px;
  }
}
.sign-title {
  div {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
.sign-footer {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
#ZCPenSign {
  border: 1px solid #000;
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
.zpDialog-img {
  width: 100%;
  text-align: center;
  img {
    display: inline-block;
    width: 600px;
    height: 300px;
  }
}
</style>
