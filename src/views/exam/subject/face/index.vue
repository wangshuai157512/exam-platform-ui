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
          sty="200px"
        >
        </jaya-select>
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
      <el-form-item prop="kchp">
        <el-input
          v-model="queryParams.kchp"
          placeholder="考车号牌"
          size="small"
        />
      </el-form-item>
      <el-form-item prop="kcbh">
        <el-input
          v-model="queryParams.kcbh"
          placeholder="考车编号"
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.rzjg"
          placeholder="认证结果"
          clearable
          size="small"
        >
          <el-option
            v-for="item in rzjgList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.rzfs"
          placeholder="认证方式"
          clearable
          size="small"
        >
          <el-option
            v-for="item in rzfsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.rzlb"
          placeholder="认证类别"
          clearable
          size="small"
        >
          <el-option
            v-for="item in rzlbList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          class="daterange"
          size="small"
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="考试开始日期"
          end-placeholder="考试结束日期"
        >
        </el-date-picker>
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
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>

    <!-- 人脸详情 -->
    <el-dialog
      :close-on-click-modal="false"
      title="人脸详情"
      :visible.sync="openDetail"
      width="1027px"
      append-to-body
    >
      <div class="listDetail">
        <div>
          <div class="imgBox">
            <img
              :src="'data:image/jpeg;base64,' + bmzpUrl"
              alt=""
              v-if="bmzpUrl"
            />
            <img
              src="../../../../assets/images/default-img.png"
              alt=""
              v-else
            />
            <h6>报名照片</h6>
          </div>
        </div>
        <div class="mesBox">
          <ul>
            <li>
              <label>流水号</label>
              <span>{{ detailMsg.lsh }}</span>
            </li>
            <li>
              <label>准考证</label>
              <span>{{ detailMsg.zkzmbh }}</span>
            </li>
            <li>
              <label>姓名</label>
              <span>{{ detailMsg.xm }}</span>
            </li>
            <li>
              <label>性别</label>
              <span>{{ detailMsg.xb === "1" ? "男" : "女" }}</span>
            </li>
            <li>
              <label>证件号码</label>
              <span>{{ detailMsg.sfzmhm }}</span>
            </li>
            <li>
              <label>考试原因</label>
              <span>{{ detailMsg.ksyy }}</span>
            </li>
            <li>
              <label>考试车型</label>
              <span>{{ detailMsg.kscx }}</span>
            </li>
            <li>
              <label>考试日期</label>
              <span>{{ detailMsg.ksrq }}</span>
            </li>
            <li>
              <label>考试科目</label>
              <span>科目{{ detailMsg.kskm === "2" ? "二" : "三" }}</span>
            </li>
            <li>
              <label>考车号牌</label>
              <span>{{ detailMsg.kchp }}</span>
            </li>
            <li>
              <label>考场简称</label>
              <span>{{ detailMsg.kcjc }}</span>
            </li>
            <li>
              <label>考试员1</label>
              <span>{{ detailMsg.ksy1 }}</span>
            </li>
            <li>
              <label>考试员2</label>
              <span>{{ detailMsg.ksy2 }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="detail-footer">
        <div class="photoBox">
          <div class="processed l-img-tit">
            <div>
              申请时间:<span>{{ detailMsg.sqsj }}</span>
            </div>
            <div style="border-right: 0">
              认证时间:<span>{{ detailMsg.rzsj }}</span>
            </div>
          </div>
          <div class="photoBoxImg">
            <img
              :src="'data:image/jpeg;base64,' + detailMsg.zp"
              alt=""
              v-if="detailMsg.zp"
              style="width: 100%; height: 100%"
            />
            <img
              src="../../../../assets/images/default-img.png"
              alt=""
              v-else
            />
          </div>
        </div>
        <div class="photoBox" style="margin-left: 20px">
          <div class="processed">
            <div style="width: 27.5%">
              认证方式:<span>{{ detailMsg.rzfs }}</span>
            </div>
            <div
              :style="
                detailMsg.rzjg === '8'
                  ? { borderRight: 0, width: '34%' }
                  : { width: '34%' }
              "
            >
              认证结果:<span>{{
                detailMsg.rzjg === "0"
                  ? "未认证"
                  : detailMsg.rzjg === "1"
                  ? "已通过"
                  : detailMsg.rzjg === "2"
                  ? "未通过"
                  : detailMsg.rzjg === "8"
                  ? "等待人工处理"
                  : ""
              }}</span>
            </div>
            <div
              :style="
                detailMsg.rzjg === '0' ? { borderRight: 0, width: '48%' } : ''
              "
              v-if="detailMsg.rzjg === '0'"
            >
              认证:
              <el-button type="success" size="mini" @click="approve('1')"
                >通过</el-button
              ><el-button type="danger" size="mini" @click="approve('2')"
                >未通过</el-button
              >
            </div>
            <div
              :style="detailMsg.rzjg !== '0' ? { borderRight: 0 } : ''"
              v-if="
                detailMsg.rzfs &&
                detailMsg.rzjg !== '8' &&
                detailMsg.rzjg !== '0' &&
                detailMsg.rzfs !== '人工认证'
              "
            >
              相似度:<span>{{ detailMsg.xsd * 100 + "%" }}</span>
            </div>
          </div>
          <div class="photoBoxImg">
            <img
              :src="'data:image/jpeg;base64,' + detailMsg.zp2"
              alt=""
              v-if="detailMsg.zp2"
              style="width: 100%; height: 100%"
            />
            <img
              src="../../../../assets/images/default-img.png"
              alt=""
              v-else
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  faceList,
  faceVerify,
  faceDeatil,
  vehiclePhoto,
  applyPhoto
} from "@/api/exam/examSubject";
const column = function () {
  return [
    {
      title: "考场简称",
      prop: "kcjc"
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
      title: "流水号",
      width: "150",
      prop: "lsh"
    },
    {
      title: "考车编号",
      width: "150",
      prop: "kcbh"
    },
    {
      title: "考试车型",
      prop: "kscx",
      status: () => {
        return "exam_car_type";
      }
    },
    {
      title: "认证人",
      prop: "rzr"
    },
    {
      title: "申请时间",
      prop: "sqsj",
      width: "200"
    },
    {
      title: "认证时间",
      prop: "rzsj",
      width: "200"
    },
    {
      title: "考试次数",
      prop: "kscs"
    },
    {
      title: "考试原因",
      prop: "ksyy",
      status: () => "exam_reason_type"
    },
    {
      title: "认证结果",
      prop: "rzjg",
      status: () => this.rzjgList
    },
    {
      title: "认证方式",
      prop: "rzfs"
    },
    {
      title: "考车号牌",
      prop: "kchp"
    },
    {
      title: "车辆品牌",
      prop: "clpp"
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
      title: "操作",
      width: "150",
      type: "buttons",
      fixed: "right",
      butList: [
        {
          title: "详情",
          size: "mini",
          onClick: this.lookDetail,
          auth: ["exam:subject:face:detail"]
        }
      ]
    }
  ];
};
export default {
  name: "face",
  data() {
    return {
      id: null,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        // kskm:"",
        // kc:"",
        kscxs: ""
        // xm:"",
        // sfzmhm:"",
        // kcbh:"",
        // rzjg:"",
        // rzfs:"",
        // rzlb:"",
        // ksrq:""
        // startDate:this.parseTime(new Date(), "{y}-{m}-{d}"),
        // endDate:this.parseTime(new Date(), "{y}-{m}-{d}"),
      },
      date: [
        this.parseTime(new Date(), "{y}-{m}-{d}"),
        this.parseTime(new Date(), "{y}-{m}-{d}")
      ],
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
      kcList: [],
      kcbhList: [],
      rzjgList: [
        {
          label: "未认证",
          value: "0"
        },
        {
          label: "已通过",
          value: "1"
        },
        {
          label: "未通过",
          value: "2"
        },
        {
          label: "等待人工处理",
          value: "8"
        }
      ],
      rzfsList: [
        {
          label: "人脸认证",
          value: "0"
        },
        {
          label: "人工认证",
          value: "1"
        }
      ],
      rzlbList: [
        {
          label: "开始考试",
          value: "0"
        },
        {
          label: "考试中",
          value: "1"
        }
      ],
      column: column.call(this),
      tableData: [],
      openDetail: false,
      // 详情信息
      detailMsg: {},
      // 报名照片
      bmzpUrl: ""
    };
  },
  methods: {
    // 获取列表
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      let queryVehicles = this.queryParams.kscxs + "";
      let params = {
        ...this.queryParams,
        kscxs: queryVehicles,
        startDate: this.date ? this.date[0] : null,
        endDate: this.date ? this.date[1] : null
      };
      faceList(params).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    // 详情
    lookDetail(row) {
      this.detailMsg = {};
      this.bmzpUrl = "";
      this.id = row.id;
      faceDeatil({ id: this.id }).then((res) => {
        this.detailMsg = res.data;
      });
      applyPhoto(row.sfzmhm).then((res) => {
        this.bmzpUrl = res.data?.zp;
      });
      this.openDetail = true;
      // 暂时不用
      // vehiclePhoto(id).then(res=> {
      //   console.log(res)
      // })
    },
    // 认证
    approve(passVal) {
      this.$confirm("确定要人工添加身份认证么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        faceVerify({ id: this.id, rzjg: passVal }).then((res) => {
          this.$message({
            type: "success",
            message: "认证成功!"
          });
          this.getTableList();
          this.openDetail = false;
        });
      });
    }
  },
  mounted() {
    this.getTableList();
  }
};
</script>

<style lang="scss" scoped>
.listDetail {
  display: flex;
  .imgBox {
    margin-bottom: 15px;
    img {
      width: 100px;
      height: 140px;
    }
    h6 {
      background-color: #ddf5d4;
      text-align: center;
      margin: 0;
      padding: 6px;
      margin-top: 2px;
    }
  }
  .mesBox {
    width: 877px;
    padding-left: 20px;
    box-sizing: border-box;
    ul {
      li {
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;
        width: 194px;
        margin-bottom: 20px;
        span {
          display: block;
          width: 100%;
          background-color: #dbe1ef;
          margin-top: 10px;
          height: 26px;
          line-height: 26px;
          border-radius: 4px;
          padding: 0 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.detail-footer {
  width: 987px;
  .photoBox {
    display: inline-block;
    vertical-align: middle;
    width: 483.5px;
    .processed {
      display: flex;
      background-color: #67767e;
      color: #fff;
      height: 40px;
      line-height: 40px;
      div {
        width: 30%;
        border-right: 1px solid #fff;
        padding-left: 10px;
        box-sizing: border-box;
      }
    }
    .l-img-tit {
      div {
        width: 478.5px;
      }
    }
    .photoBoxImg {
      margin-top: 20px;
      width: 100%;
      height: 300px;
      border: 1px solid #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
.daterange {
  width: 260px !important;
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
