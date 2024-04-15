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
        <el-input
          v-model="queryParams.kcbh"
          placeholder="考车编号"
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.kchp"
          placeholder="考车号牌"
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="queryParams.jcsj"
          size="small"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="检测日期"
        ></el-date-picker>
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
      <!-- <el-form-item class="fun-btn-right">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleExport"
          >导出</el-button
        >
      </el-form-item> -->
    </el-form>
    <jaya-table-group
      :total="total"
      :tableHeaderList="column"
      :tableList="tableData"
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>

    <!-- 详情弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="详情"
      :visible.sync="openDetail"
      width="680px"
      append-to-body
      disabled
    >
      <el-form ref="form" :inline="true" disabled class="dialogForm">
        <el-form-item label="考试科目">
          <el-select v-model="form.kskm" placeholder="考试科目" size="small">
            <el-option
              v-for="item in kskmList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考场简称">
          <jaya-select type="K" v-model="form.kcxh"></jaya-select>
        </el-form-item>
        <el-form-item label="考车编号">
          <el-input v-model="form.kcbh" placeholder="" />
        </el-form-item>
        <!-- 考车字段待定 -->
        <el-form-item label="车牌号码">
          <el-input v-model="form.kchp" placeholder="" size="small" />
        </el-form-item>
        <el-form-item label="考试车型">
          <jaya-select
            v-model="form.kscx"
            placeholder=""
            othername="exam_car_type"
          >
          </jaya-select>
        </el-form-item>
        <el-form-item label="检测日期">
          <el-input v-model="form.jcsj" placeholder="" size="small" />
        </el-form-item>
      </el-form>
      <div class="sing-tag" v-if="singList.length > 0">
        <div
          class="sing-tag-item"
          v-for="(item, index) in singList"
          :key="index"
        >
          <div class="sing-img">
            <img
              v-if="baseImgUrl.indexOf(item.checkKey) !== -1"
              :src="
                require(`../../../../assets/icons/signal/${item.checkKey.replace(
                  /(^\s+)|(\s+$)/g,
                  ''
                )}.png`)
              "
              alt=""
            />
          </div>
          <div>
            <h6>{{ item.checkKey }}</h6>
            <span style="color: red" v-if="item.checkResult === '0'"
              >x 失败</span
            >
            <span style="color: green" v-if="item.checkResult === '1'"
              >✔ 成功</span
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { detectionList, detectionDetail, retest } from "@/api/exam/examSubject";
const column = function () {
  return [
    {
      title: "考场简称",
      prop: "kcjc",
    },
    {
      title: "考试车型",
      prop: "kscx",
      status: () => {
        return "exam_car_type";
      },
    },
    {
      title: "考车编号",
      prop: "kcbh",
    },
    {
      title: "考车号牌",
      prop: "kchp",
    },
    {
      title: "检测日期",
      width: "150",
      prop: "jcsj",
    },
    {
      title: "检测结果",
      prop: "jcjg",
      status: () => this.jcjgList,
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
          onClick: this.lookDetail,
          auth: ["exam:subject:detection:detail"],
        },
        {
          title: "重新检测",
          size: "mini",
          onClick: this.lookcheck,
          auth: ["exam:subject:detection:check"],
        },
      ],
    },
  ];
};
export default {
  name: "detection",
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        kscxs: "",
        jcsj: this.parseTime(new Date(), "{y}-{m}-{d}"),
      },
      kskmList: [
        {
          label: "科目二",
          value: "2",
        },
        {
          label: "科目三",
          value: "3",
        },
      ],
      column: column.call(this),
      tableData: [],
      jcjgList: [
        {
          label: "未通过",
          value: "0",
        },
        {
          label: "已通过",
          value: "1",
        },
        {
          label: "重新检测",
          value: "3",
        },
      ],
      openDetail: false,
      form: {},
      singList: [],
      baseImgUrl: [
        "GPS",
        "安全带",
        "差分状态",
        "车门",
        "打火",
        "挡位",
        "副刹",
        "观望镜",
        "后绕车",
        "后视镜",
        "脚刹",
        "近光灯",
        "喇叭",
        "离合",
        "前绕车",
        "绕车",
        "示廓灯",
        "视频",
        "手刹",
        "雾灯",
        "熄火",
        "右震动",
        "右转向灯",
        "雨刷",
        "远光灯",
        "左震动",
        "左转向灯",
        "座椅",
        "座椅压力",
        "转速",
      ],
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      let queryVehicles = this.queryParams.kscxs + "";
      detectionList({ ...this.queryParams, kscxs: queryVehicles }).then(
        (res) => {
          this.tableData = res.rows;
          this.total = res.total;
        }
      );
    },
    lookDetail(row) {
      detectionDetail({ id: row.xh }).then((res) => {
        this.form = res.data;
        this.singList = res.data.checkItems;
        this.openDetail = true;
      });
    },
    //重新检测
    lookcheck({ xh }) {
      this.$confirm("是否重新检测", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          retest({ xh }).then((res) => {
            this.msgSuccess("操作成功");
          });
        })
        .catch(() => {});
    },
    getImg() {
      alert("err");
    },
  },
  mounted() {
    this.getTableList();
  },
};
</script>
<style lang="scss" scoped>
.el-dialog {
  .el-input,
  .el-select {
    width: 194px;
  }
}
.sing-tag {
  margin-top: 20px;
  padding: 20px 20px 0 0;
  box-sizing: border-box;
  border: 1px solid #c6ddef;
  .sing-tag-item {
    display: inline-block;
    vertical-align: middle;
    padding-left: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    div {
      display: inline-block;
      vertical-align: middle;
      h6 {
        margin-bottom: 8px;
        margin-top: 0;
        min-width: 48px;
      }
    }
    .sing-img {
      margin-right: 10px;
      img {
        width: 40px;
        height: 40px;
      }
    }
  }
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
