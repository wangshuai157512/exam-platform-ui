<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh">
        <jaya-select v-model="queryParams.kcxh" type="K" size="small" />
      </el-form-item>
      <el-form-item prop="kscx">
        <jaya-select
          collapse-tags
          v-model="queryParams.kscx"
          placeholder="考试车型"
          othername="exam_car_type"
          multiple
          size="small"
        >
        </jaya-select>
      </el-form-item>
      <!-- <el-form-item prop="kssb">
        <jaya-select v-model="queryParams.kssb" type="T" />
      </el-form-item> -->
      <el-form-item prop="jyclbf">
        <el-select
          placeholder="处理方式"
          v-model="queryParams.jyclbf"
          size="small"
          clearable
        >
          <el-option
            v-for="option in jyclbfView"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="shjg">
        <el-select
          placeholder="审核结果"
          v-model="queryParams.shjg"
          size="small"
          clearable
        >
          <el-option
            v-for="option in shView"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="xm">
        <el-input
          size="small"
          v-model="queryParams.xm"
          placeholder="姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="sfzmhm">
        <el-input
          size="small"
          style="width: 180px"
          v-model="queryParams.sfzmhm"
          placeholder="身份证号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="lsh">
        <el-input
          size="small"
          style="width: 180px"
          v-model="queryParams.lsh"
          placeholder="流水号"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item prop="yclx">
        <jaya-select
          v-model="queryParams.yclx"
          placeholder="异常类型"
          clearable
          size="small"
          othername="ex_request_type"
        />
        <!-- <el-option
            v-for="(option, index) in yclxView"
            :key="index"
            :label="option.label"
            :value="option.value"
          />
        </el-select> -->
      </el-form-item>
      <el-form-item prop="zt">
        <el-select
          placeholder="处理状态"
          v-model="queryParams.zt"
          size="small"
          clearable
        >
          <el-option
            v-for="(option, index) in ztView"
            :key="index"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="ksrq">
        <el-date-picker
          class="daterange"
          size="small"
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="考试开始"
          end-placeholder="考试结束"
          clearable
        >
        </el-date-picker>
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
      title="详情"
      :visible.sync="visible"
      width="1360px"
      append-to-body
    >
      <div style="display: flex">
        <div style="width: 260px; margin-right: 10px">
          <div class="potro">
            <div>
              <el-image :src="reportPhoto">
                <span slot="error" class="image-slot"> 暂无图片 </span>
              </el-image>
              <p class="zpmc">报名照片</p>
            </div>
            <div>
              <el-image :src="controlPhoto">
                <span slot="error" class="image-slot"> 暂无图片 </span>
              </el-image>
              <p class="zpmc">门禁照片</p>
            </div>
          </div>
          <div style="min-width: 120px; width: auto" class="jaya-row">
            <label for="">姓名</label>
            <p>{{ form.xm }}</p>
          </div>
          <div style="width: 60px" class="jaya-row">
            <label for="">性别</label>
            <p>{{ form.xb == 1 ? "男" : "女" }}</p>
          </div>
          <div class="jaya-row">
            <label for="">身份证号码</label>
            <p>{{ form.sfzmhm }}</p>
          </div>
          <div class="jaya-row">
            <label for="">驾校名称</label>
            <p>{{ form.jxjc }}</p>
          </div>
          <div class="jaya-row">
            <label for="">管理部门</label>
            <p>{{ form.glbm }}</p>
          </div>
          <div class="jaya-row">
            <label for="">考场简称</label>
            <p>{{ form.kcjc }}</p>
          </div>
        </div>
        <div style="width: 1060px">
          <el-form
            :disabled="true"
            class="dialogForm"
            :model="form"
            ref="form"
            :inline="true"
          >
            <el-form-item label="流水编号" prop="lsh">
              <el-input v-model="form.lsh" size="small" />
            </el-form-item>
            <el-form-item label="证件号码" prop="sfzmhm">
              <el-input v-model="form.sfzmhm" size="small" />
            </el-form-item>
            <el-form-item label="考车牌号" prop="kchp">
              <el-input v-model="form.kchp" size="small" />
            </el-form-item>
            <el-form-item label="考试员01" prop="ksy1">
              <el-input v-model="form.ksy1" size="small" />
            </el-form-item>
            <el-form-item label="考试员02" prop="ksy2">
              <el-input v-model="form.ksy2" size="small" />
            </el-form-item>
            <el-form-item label="考生姓名" prop="xm">
              <el-input v-model="form.xm" size="small" />
            </el-form-item>
            <el-form-item label="考试原因" prop="ksyy">
              <jaya-select
                v-model="form.ksyy"
                placeholder="考试原因"
                othername="exam_reason_type"
              >
              </jaya-select>
            </el-form-item>
            <el-form-item label="发行机关" prop="fzjg">
              <el-input v-model="form.fzjg" size="small" />
            </el-form-item>
            <el-form-item label="比对结果" prop="bdjg">
              <el-input v-model="form.bdjg" size="small" />
            </el-form-item>
            <el-form-item label="经办人" prop="jbr">
              <el-input v-model="form.jbr" size="small" />
            </el-form-item>
            <el-form-item label="驾校名称" prop="jxmc">
              <el-input v-model="form.jxmc" size="small" />
            </el-form-item>
            <el-form-item label="考试状态" prop="kszt">
              <el-select
                placeholder="考试状态"
                v-model="form.kszt"
                size="small"
              >
                <el-option
                  v-for="(option, index) in [
                    { value: '1', label: '考试中' },
                    { value: '2', label: '考试结束' }
                  ]"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="考试科目" prop="kskm">
              <el-select
                placeholder="考试科目"
                v-model="form.kskm"
                size="small"
              >
                <el-option
                  v-for="(option, index) in [
                    { value: '2', label: '科目二' },
                    { value: '3', label: '科目三' }
                  ]"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="考试日期" prop="ksrq">
              <el-input v-model="form.ksrq" size="small" />
            </el-form-item>
            <el-form-item label="考试成绩" prop="kscj">
              <el-input v-model="form.kscj" size="small" />
            </el-form-item>
            <el-form-item label="记录状态" prop="jlzt">
              <el-select
                placeholder="记录状态"
                v-model="form.jlzt"
                size="small"
              >
                <el-option
                  v-for="(option, index) in [
                    { value: '1', label: '正常' },
                    { value: '2', label: '暂停' },
                    { value: '3', label: '取消考试' },
                    { value: '0', label: '作废' }
                  ]"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="考试车型" prop="kscx">
              <el-input v-model="form.kscx" size="small" />
            </el-form-item>
            <!-- <el-form-item label="管理部门" prop="ksxh">
          <el-input v-model="form.ksxh" size="small" />
        </el-form-item> -->
            <el-form-item label="合格标记" prop="hgbj">
              <el-select
                placeholder="合格标记"
                v-model="form.hgbj"
                size="small"
              >
                <el-option
                  v-for="(option, index) in [
                    { value: '1', label: '合格' },
                    { value: '2', label: '不合格' },
                    { value: '0', label: '未判定' }
                  ]"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="传输标记" prop="csbj">
          <el-input v-model="form.csbj" size="small" />
        </el-form-item> -->
            <el-form-item label="预约次数" prop="yycs">
              <el-input v-model="form.yycs" size="small" />
            </el-form-item>
            <el-form-item label="考试次数" prop="kscs">
              <el-input v-model="form.kscs" size="small" />
            </el-form-item>
            <!-- <el-form-item label="记录结果" prop="jljg">
          <el-input v-model="form.jljg" size="small" />
        </el-form-item> -->
          </el-form>
          <div style="margin-bottom: 10px">
            <el-button @click="handleExamView" size="small" type="primary"
              >预览成绩单</el-button
            >
            <el-button @click="handleExamViewPhoto" size="small" type="primary"
              >考试截图</el-button
            >
            <el-button @click="handleExamVideoPlay" size="small" type="primary"
              >视频回放</el-button
            >
          </div>
          <el-table :data="tableData" class="tableStyle" style="width: 100%">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="xmmc" label="考试项目" width="180" />
            <el-table-column label="扣分项目" width="300">
              <template slot-scope="scope">
                <span v-for="(kfxx, index) in scope.row.kfxxes" :key="index">{{
                  kfxx.kfms
                }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="name" label="考试车辆" width="120" /> -->
            <el-table-column prop="kssj" label="开始时间" width="200" />
            <el-table-column prop="jssj" label="结束时间" width="200" />
            <!-- <el-table-column prop="name" label="状 态" width="120" /> -->
            <el-table-column label="截 图" width="80">
              <template slot-scope="scope">
                <el-button
                  @click="handleCheckClick(scope.row)"
                  type="text"
                  size="small"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-bottom: 10px">
            <div v-if="formDispose.zt == 1" class="xxShow">
              <span>审核人：{{ formDispose.shrxm }}</span>
              <span>审核信息：{{ formDispose.shxx }}</span>
              <span
                >审核结果：{{
                  shView[Number(formDispose.shjg) - 1].label
                }}</span
              >
            </div>
            <el-form
              v-else
              ref="forms"
              class="dialogForm"
              :model="form"
              label-width="100px"
              size="mini"
            >
              <el-form-item label="审核结果" prop="shjg" style="margin: 20px">
                <el-radio-group v-model="forms.shjg">
                  <el-radio
                    v-for="option in shView"
                    :key="option.value"
                    :label="option.value"
                    @change="changeRadio(option.value)"
                    >{{ option.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审核信息" style="margin: 20px">
                <el-input
                  type="textarea"
                  rows="3"
                  maxlength="100"
                  show-word-limit
                  v-model="forms.shxx"
                  @input="$forceUpdate()"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <el-dialog
            :close-on-click-modal="false"
            append-to-body
            title="考试截图"
            :visible.sync="photoVisible"
          >
            <div style="display: flex; flex-wrap: wrap">
              <el-image
                style="width: 33%"
                v-for="(url, index) in photo"
                :key="index"
                :src="url"
              >
                <div slot="placeholder" class="image-slot">加载失败</div>
              </el-image>
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
                ref="tranIframe"
                style="width: 100%; height: 100%"
                :src="iframeSrc"
                frameborder="0"
              ></iframe>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="print">打印</el-button>
            </span>
          </el-dialog>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="ycshAudit('forms')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExamResultPageList,
  getExamResultInfo,
  getExamVideoPlay,
  getExamXVideoPlay,
  getExamViewPhoto,
  getExamXViewPhoto,
  abnormalApply
} from "@/api/exam/record";
import { applyPhoto, entrancePhoto } from "@/api/exam/examSubject";
import { abnormalList, exceptionHandling } from "@/api/exam/dispose/abnormal";

const column = function () {
  return [
    {
      title: "序号",
      slotFn: (item, index) => index + 1,
      width: "80"
    },
    //    {
    //   title: "考场序号",
    //   prop: "kcxh",
    // },

    {
      title: "考场简称",
      prop: "kcjc"
    },
    {
      title: "考生姓名",
      prop: "xm"
    },
    {
      title: "身份证明号码",
      prop: "sfzmhm",
      width: "180"
    },
    {
      title: "考试科目",
      prop: "kskm"
    },
    {
      title: "考试原因",
      prop: "ksyy",
      status: () => "exam_reason_type"
    },
    {
      title: "发生时间",
      prop: "fssj"
    },
    {
      title: "异常类型",
      prop: "yclx",
      status: () => this.yclxView
    },
    {
      title: "异常信息",
      prop: "ycxx"
    },
    {
      title: "建议处理办法",
      prop: "jyclbb",
      status: () => this.jyclbfView
    },
    {
      title: "操作人姓名",
      prop: "czrxm",
      width: "120"
    },
    {
      title: "状态",
      prop: "zt",
      status: () => this.ztView
    },

    {
      title: "审核人",
      prop: "shrxm"
    },

    {
      title: "审核结果",
      prop: "shjg",
      status: () => this.shView
    },
    {
      title: "审核时间",
      prop: "clsj"
    },
    {
      title: "审核信息",
      prop: "shxx"
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
          auth: ["exam:subject:dispose:detail"]
        }
      ]
    }
  ];
};
export default {
  name: "record",
  data() {
    return {
      shView: [
        // { value: 0, label: "未审核" },
        { value: 1, label: "通过" },
        { value: 2, label: "未通过" }
        // { value: 3, label: "已忽略" },
      ],
      yclxView: [
        { value: "0", label: "考试异常" },
        { value: "1", label: "分数异常" },
        { value: "2", label: "设备异常" }
      ],
      ztView: [
        { value: 0, label: "未处理" },
        { value: 1, label: "已处理" }
      ],
      jyclbfView: [
        { value: "0", label: "重新考试" },
        { value: "1", label: "成绩作废" }
      ],
      // rules: {
      //   shjg: [{ required: true, trigger: "blur", message: "必填项" }],
      //   shxx: [{ required: true, trigger: "blur", message: "必填项" }],
      // },
      total: 0,
      visible: false,
      photoVisible: false,
      tranScriptVisible: false,
      open: false,
      iframeSrc: "",
      tableList: [],
      tableData: [],
      form: {},
      formDispose: {},
      forms: {
        id: "",
        shjg: null,
        shxx: ""
      },
      photo: [],
      date: [
        this.parseTime(new Date(), "{y}-{m}-{d}"),
        this.parseTime(new Date(), "{y}-{m}-{d}")
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 20
        // jssj: "",
        // jyclbf: "",
        // kcxh: "",
        // kscx: "",
        // kssj: "",
        // lsh: "",
        // sfzmhm: "",
        // shjg: "",
        // xm: "",
        // yclx: "",
        // zt: "",
      },
      column: column.call(this),
      ksxh: null,
      reportPhoto: null,
      controlPhoto: null
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      abnormalList({
        ...this.queryParams,
        kssj: this.date ? this.date[0] : "",
        jssj: this.date ? this.date[1] : "",
        kscx: this.queryParams.kscx?.join()
      }).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
      });
    },
    changeRadio(value) {
      this.$set(this.forms, "shjg", value);
      this.$forceUpdate();
    },
    //详情
    handleDetail(row) {
      this.formDispose = { ...row };
      let { id, ksxh, shjg, shxx } = row;
      this.forms = {};
      this.tableData = [];
      this.forms.id = id;
      this.forms.shjg = shjg;
      this.forms.shxx = shxx;
      this.ksxh = ksxh;

      // 查询考试详情
      getExamResultInfo({ ksxh }).then((res) => {
        this.visible = true;
        this.form = res.data;
        const { sfzmhm, kcxh, ksrq } = res.data;
        // 查询考试项目截图列表
        getExamViewPhoto(ksxh).then((res) => {
          this.tableData = res.data;
        });

        // 查询报名照片
        applyPhoto(sfzmhm).then((res) => {
          if (res.data)
            this.reportPhoto = `data:image/png;base64,${decodeURIComponent(
              res.data.zp
            )}`;
        });

        // 查询门禁照片
        entrancePhoto(`${kcxh}/${sfzmhm}/${ksrq}`).then((res) => {
          if (res.data)
            this.controlPhoto = `data:image/png;base64,${decodeURIComponent(
              res.data.zp
            )}`;
        });
      });
    },

    // 列表查看截图
    handleCheckClick({ xmksxh }) {
      this.photo = [];
      getExamXViewPhoto(xmksxh).then((res) => {
        this.photoVisible = true;
        this.photo = [
          `data:image/png;base64,${decodeURIComponent(res.data.zp)}`
        ];
      });
    },

    // 成绩单预览
    handleExamView() {
      const { href } = this.$router.resolve({
        name: "TranScript"
      });

      this.iframeSrc = `${href}?${this.ksxh}`;
      this.tranScriptVisible = true;
    },
    //打印
    print() {
      // 判断是否IE
      if ("ActiveXObject" in window) {
        this.$refs.tranIframe.contentWindow.document.execCommand("print");
        return;
      }
      this.$refs.tranIframe.contentWindow.print();
    },
    // 查看全部截图
    handleExamViewPhoto() {
      this.photo = [];
      Promise.all(
        this.tableData.map(({ xmksxh }) => {
          return new Promise((resolve, reject) => {
            getExamXViewPhoto(xmksxh).then((res) => {
              resolve(
                `data:image/png;base64,${decodeURIComponent(res.data.zp)}`
              );
            });
          });
        })
      ).then((photo) => {
        this.photo = photo;
        this.photoVisible = true;
      });
    },

    // 查看视频回放
    handleExamVideoPlay() {
      const { href } = this.$router.resolve({
        name: "VideoPlay"
      });

      window.open(
        `${href}?${this.ksxh}`, //ksxh
        "_blank",
        `fullscreen=no,location=no,width=800,height=${window.screen.availHeight}`
      );
    },
    //详情弹窗的确定按钮（判断审核结果）
    ycshAudit() {
      exceptionHandling(this.forms).then(() => {
        // this.msgSuccess("已审核");
        this.visible = false;
        this.getTableList();
      });
    }
  },
  mounted() {
    this.getTableList();
  }
};
</script>

<style lang="scss" scoped>
// /deep/.tableStyle {
//     text-align: center;
// }
.xxShow {
  height: 50px;
  margin-top: 20px;
  span {
    margin-right: 15px;
  }
}
#map {
  height: 500px;
  margin-top: 20px;
}
/*隐藏ol的一些自带元素*/
.ol-attribution,
.ol-zoom {
  display: none;
}
.progress-bar {
  width: 100%;
  height: 30px;
  margin: 30px 0;
  // background: url("~@/assets/bg-5.png") center bottom no-repeat;
  background-size: 100% 30px;
  position: relative;
  box-sizing: border-box;
  .bar-box {
    position: absolute;
    top: 10px;
    left: 30px;
    right: 30px;
    height: 10px;
    border-radius: 5px;
    background: #034c77;
  }
  .bar {
    height: 10px;
    border-radius: 5px;
    // background: url("~@/assets/bg-6.png") 0 bottom repeat #ecc520;
    position: relative;
    span {
      width: 50px;
      height: 50px;
      line-height: 18px;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      position: absolute;
      color: #fe0000;
      top: -30px;
      right: -25px;
      // background: url("~@/assets/bg-7.png") center 0 no-repeat;
      background-size: 100% 30px;
    }
  }
}

.daterange {
  width: 240px !important;
}

.potro {
  background: white;
  display: flex;
  justify-content: space-between;
  div {
    width: 48%;
    display: inline-block;
    // background: #f5f7fa;
    .el-image {
      width: 100%;
      height: 140px;
      text-align: center;
      line-height: 140px;
      background: #f5f7fa;
    }
    .zpmc {
      background: yellowgreen;
      text-align: center;
      margin-top: 2px;
    }
  }
}

.jaya-row {
  width: 194px;
  display: inline-block;
  margin-bottom: 10px;
  margin-right: 10px;
  label {
    font-size: 12px;
  }
  p {
    height: 32px;
    border-radius: 4px;
    padding: 0 15px;
    box-sizing: border-box;
    border: 1px solid #70787c;
    line-height: 32px;
    color: #606266;
    background-color: #f5f7fa;
    border-color: #dfe4ed;
  }
}
</style>
