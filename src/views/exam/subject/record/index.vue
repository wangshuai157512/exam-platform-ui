<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh">
        <jaya-select v-model="queryParams.kcxh" type="K" />
      </el-form-item>
      <el-form-item prop="kscxs">
        <jaya-select
          collapse-tags
          v-model="queryParams.kscxs"
          placeholder="考试车型"
          othername="exam_car_type"
          multiple
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
            :value="option.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="jxxh">
        <jaya-select v-model="queryParams.jxxh" type="L" />
      </el-form-item>
      <!-- <el-form-item prop="kssb">
        <jaya-select v-model="queryParams.kssb" type="T" />
      </el-form-item> -->
      <el-form-item prop="ksyy">
        <jaya-select
          @getOptions="getOptions"
          v-model="queryParams.ksyy"
          placeholder="考试原因"
          othername="exam_reason_type"
        >
        </jaya-select>
      </el-form-item>
      <el-form-item prop="ksjg">
        <el-select
          placeholder="考试结果"
          v-model="queryParams.ksjg"
          size="small"
          clearable
        >
          <el-option
            v-for="(option, index) in jgl"
            :key="index"
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
        ></el-input>
      </el-form-item>
      <el-form-item prop="sfzmhm">
        <el-input
          size="small"
          style="width: 180px"
          v-model="queryParams.sfzmhm"
          placeholder="身份证号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="lsh">
        <el-input
          size="small"
          style="width: 180px"
          v-model="queryParams.lsh"
          placeholder="流水号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="kcbh">
        <el-input
          size="small"
          style="width: 180px"
          v-model="queryParams.kcbh"
          placeholder="考车编号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="kchp">
        <el-input
          size="small"
          v-model="queryParams.kchp"
          placeholder="车牌号码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="ksy1">
        <jaya-select v-model="queryParams.ksy1" type="S" />
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
      <el-form-item prop="">
        <el-button
          @click="downloadGps"
          icon="el-icon-download"
          size="small"
          type="primary"
          >批量轨迹下载</el-button
        >
      </el-form-item>
      <el-form-item class="fun-btn-right" prop="">
        <el-button
          @click="handleExport"
          icon="el-icon-download"
          size="small"
          type="primary"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <jaya-table-group
      :total="total"
      :isCalcWidth="true"
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
            <label for="">身份证明号码</label>
            <p>{{ form.sfzmhm }}</p>
          </div>
          <div class="jaya-row">
            <label for="">驾校名称</label>
            <p>{{ form.jxmc }}</p>
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
                    { value: '2', label: '考试结束' },
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
                    { value: '3', label: '科目三' },
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
                    { value: '0', label: '作废' },
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
                    { value: '0', label: '未判定' },
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
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="xmmc" label="考试项目" width="150" />
            <el-table-column label="扣分详情">
              <template slot-scope="scope">
                <p v-for="(kfxx, index) in scope.row.kfxxes" :key="index">
                  {{ kfxx.kfsj }}，扣{{ kfxx.kfz }}分，{{ kfxx.kfdm }}，{{
                    kfxx.kfms
                  }}
                </p>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="name" label="考试车辆" width="120" /> -->
            <el-table-column prop="kssj" label="开始时间" width="160" />
            <el-table-column prop="jssj" label="结束时间" width="160" />
            <!-- <el-table-column prop="name" label="状 态" width="120" /> -->
            <el-table-column label="截 图" width="80">
              <template slot-scope="scope">
                <el-button
                  @click="handleCheckClick(scope.$index)"
                  type="text"
                  size="small"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            class="wrapper-padding"
            width="1000px"
            :close-on-click-modal="false"
            append-to-body
            title="考试截图"
            :visible.sync="photoVisible"
          >
            <div style="display: flex; height: 600px">
              <div style="width: 200px; background: rgb(0, 217, 255)">
                <!-- <h3 style="margin: 0">考试项目</h3> -->
                <ul style="height: 100%; overflow-y: scroll">
                  <li
                    v-for="(item, index) in tableData"
                    :key="item.xmdm"
                    :class="itemCount == index ? 'item-actv' : ''"
                    class="item"
                    @click="handleItemClick(index)"
                  >
                    {{ item.xmmc }}
                  </li>
                </ul>
              </div>
              <div
                style="
                  width: 800px;
                  display: flex;
                  flex-wrap: wrap;
                  height: 100%;
                  overflow-y: scroll;
                "
              >
                <img
                  style="object-fit: cover; margin-bottom: 2px; height: 400px"
                  v-for="(url, index) in photo"
                  v-show="url"
                  :key="index"
                  :src="url"
                />
                <div v-if="photo.length == 0" class="image-slot">暂无图片</div>
              </div>
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
      <div>
        <el-dialog
          :close-on-click-modal="false"
          width="600px"
          append-to-body
          title="异常申请"
          :visible.sync="open"
        >
          <el-form
            ref="forms"
            class="dialogForm"
            :model="forms"
            label-width="100px"
            size="mini"
            :rules="rules"
          >
            <el-form-item
              label="建议处理办法"
              prop="jyclbb"
              style="margin: 20px"
            >
              <el-radio-group v-model="forms.jyclbb">
                <el-radio
                  v-for="dict in bfOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="考试序号" prop="ksxh" style="margin: 20px">
              <el-input
                v-model="forms.ksxh"
                placeholder="请输入考试序号"
                :disabled="true"
              />
            </el-form-item>
            <!-- <el-form-item label="异常类型" prop="yclx" style="margin: 20px">
              <el-input
                v-model="forms.yclx"
                placeholder="请输入"
              />
            </el-form-item> -->

            <el-form-item label="异常类型" prop="yclx" style="margin: 20px">
              <jaya-select
                v-model="forms.yclx"
                placeholder="请选择"
                size="small"
                othername="ex_request_type"
              />
            </el-form-item>

            <el-form-item label="异常信息" prop="ycxx" style="margin: 20px">
              <el-input
                v-model="forms.ycxx"
                type="textarea"
                maxlength="100"
                placeholder="请输入内容"
                show-word-limit
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="open = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('forms')"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="exceptionApplication">异常申请</el-button>
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import {
  getExamResultPageList,
  getExamResultExport,
  getExamResultInfo,
  getExamVideoPlay,
  getExamXVideoPlay,
  getExamViewPhoto,
  getExamXViewPhoto,
  abnormalApply,
  singleDownloadGps,
  batchDownloadGps,
} from "@/api/exam/record";
import { applyPhoto, entrancePhoto } from "@/api/exam/examSubject";
import { getLineSelect } from "@/api/param/select";
import { exce } from "../statistics/mixin";
import { baseToBlob } from "@/utils/index";
const column = function () {
  return [
    {
      title: "序号",
      slotFn: (item, index) => index + 1,
      width: "80",
    },
    {
      title: "姓名",
      width: "150",
      prop: "xm",
    },
    {
      title: "车型",
      width: "100",
      prop: "kscx",
    },
    {
      title: "考车编号",
      prop: "kcbh",
    },
    {
      title: "驾校简称",
      prop: "jxjc",
      width: "120",
    },
    {
      title: "是否合格",
      width: "120",
      prop: "ksy1",
      slotFn: ({ hgbj }, index) => {
        return { 1: "合格", 2: "不合格" }[hgbj];
      },
    },
    {
      title: "成绩",
      width: "80",
      prop: "kscj",
    },
    {
      title: "考试线路",
      width: "100",
      prop: "ksxl",
    },
    {
      title: "开始时间",
      width: "180",
      prop: "kssj",
    },
    {
      title: "结束时间",
      width: "180",
      prop: "jssj",
    },
    {
      title: "考试原因",
      width: "80",
      prop: "ksyy",
      status: () => "exam_reason_type",
    },
    {
      title: "考试员",
      width: "120",
      prop: "ksy1",
    },
    {
      title: "身份证",
      width: "180",
      prop: "sfzmhm",
    },
    {
      title: "流水号",
      prop: "lsh",
    },
    {
      title: "考试次数",
      width: "100",
      prop: "kscs",
    },
    {
      title: "考场简称",
      prop: "kcjc",
      width: "120",
    },
    {
      title: "考试车辆",
      width: "100",
      prop: "hphm",
    },
    {
      title: "预约次数",
      width: "180",
      prop: "yycs",
    },
    // {
    //   title: "驾校简称",
    //   prop: "rzfs",
    // },
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
          auth: ["exam:record:detail"],
        },
        {
          title: "轨迹下载",
          size: "mini",
          onClick: this.handleTrack,
          auth: ["exam:record:detail"],
        },
      ],
    },
  ];
};
const exelColumn = function () {
  return [
    {
      title: "身份证",
      width: "180",
      prop: "sfzmhm",
    },
    {
      title: "姓名",
      width: "150",
      prop: "xm",
    },
    {
      title: "考场简称",
      prop: "kcjc",
      width: "120",
    },
    {
      title: "考车编号",
      prop: "kcbh",
    },
    {
      title: "驾校简称",
      prop: "jxjc",
      width: "120",
    },
    {
      title: "车型",
      width: "100",
      prop: "kscx",
    },

    {
      title: "考试员",
      width: "120",
      prop: "ksy1",
    },
    {
      title: "扣分信息",
      width: "80",
      prop: "kfxx",
    },
    {
      title: "是否合格",
      prop: "sfhg",
    },
    {
      title: "成绩",
      width: "80",
      prop: "kscj",
    },
    {
      title: "考试线路",
      width: "100",
      prop: "ksxl",
    },
    {
      title: "开始时间",
      width: "180",
      prop: "kssj",
    },
    {
      title: "结束时间",
      width: "180",
      prop: "jssj",
    },
    {
      title: "流水号",
      prop: "lsh",
    },
    {
      title: "考试次数",
      width: "100",
      prop: "kscs",
    },
    {
      title: "考试车辆",
      width: "100",
      prop: "hphm",
    },
    {
      title: "预约次数",
      width: "180",
      prop: "yycs",
    },
    {
      title: "考试原因",
      width: "80",
      prop: "ksyy",
    },
  ];
};
let ksyyl = [];
export default {
  name: "record",
  mixins: [exce],
  data() {
    return {
      toDady: this.parseTime(new Date(), "{y}-{m}-{d}"),
      startTime: null,
      jgl: [
        { value: "1", label: "合格" },
        { value: "2", label: "不合格" },
      ],
      total: 0,
      visible: false,
      photoVisible: false,
      tranScriptVisible: false,
      open: false,
      iframeSrc: "",
      tableList: [],
      tableData: [],
      form: {},
      forms: {
        jyclbb: "",
        ksxh: "",
        yclx: "",
        ycxx: "",
      },
      photo: [],
      yclxView: [
        { value: "0", label: "考试异常" },
        { value: "1", label: "分数异常" },
        { value: "2", label: "设备异常" },
      ],
      date: [
        this.parseTime(new Date(), "{y}-{m}-{d}"),
        this.parseTime(new Date(), "{y}-{m}-{d}"),
      ],
      rules: {
        jyclbb: [{ required: true, trigger: "blur", message: "必填项" }],
        yclx: [{ required: true, trigger: "change", message: "必填项" }],
        ycxx: [{ required: true, trigger: "blur", message: "必填项" }],
      },
      bfOptions: [
        {
          dictLabel: "重新考试",
          dictValue: "0",
        },
        {
          dictLabel: "成绩作废",
          dictValue: "1",
        },
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      ksxlList: [],
      column: column.call(this),
      exelColumn: exelColumn.call(this),
      ksxh: null,
      reportPhoto: null,
      controlPhoto: null,
      itemCount: null,
      exelTableList: [],
      columnWidths: { 7: "38" },
      barData: {
        textTitle: "考试记录",
      },
    };
  },
  methods: {
    handleItemClick(index) {
      this.itemCount = index;
      this.photo = [];
      getExamXViewPhoto(this.tableData[index].xmksxh).then((res) => {
        this.photo = res.data
          ? res.data.map(
              (url) => `data:image/png;base64,${decodeURIComponent(url.zp)}`
            )
          : [];
      });
    },
    getOptions(res) {
      ksyyl = res.data;
    },
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      getExamResultPageList({
        ...this.queryParams,
        startDate: this.date ? this.date[0] : "",
        endDate: this.date ? this.date[1] : "",
        kscxs: this.queryParams.kscxs?.join(),
      }).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
      });
    },
    // 导出
    handleExport() {
      let { pageNum, pageSize, ...excelQuery } = this.queryParams;
      getExamResultExport({
        ...excelQuery,
        startDate: this.date ? this.date[0] : "",
        endDate: this.date ? this.date[1] : "",
        kscxs: this.queryParams.kscxs?.join(),
      }).then((res) => {
        res.data.forEach((item) => {
          if (item.hgbj == 1) {
            item.sfhg = "合格";
          } else if (item.hgbj == 2) {
            item.sfhg = "不合格";
          }

          // console.log(ksyyl.find(jtem=>jtem.value==item.ksyy))
          item.ksyy = ksyyl.find((jtem) => jtem.value == item.ksyy)?.label;
        });
        this.exelTableList = res.data;
        this.exelTableList.forEach((item) => {
          if (!item.ppxmxx || item.ppxmxx.length <= 0) return;
          item.kfxx = "";
          item.kfxx = item.ppxmxx
            .map((itemC) => {
              return (
                itemC.kfsj +
                "，扣" +
                itemC.kfz +
                "分，" +
                itemC.kfdm +
                "，" +
                itemC.kfms +
                "。"
              );
            })
            .join("\n");
        });
        this.exelExport();
      });
    },
    handleTrack({ ksxh, sfzmhm, lsh, kcbh, kscj, kscs }) {
      singleDownloadGps({ ksxh }).then((res) => {
        if (!res.data) return this.msgWarn(res.msg);
        const { ksgj, ksxtgj, ksdd, kskm, ksxh } = res.data;
        if (ksgj) {
          const linkKsgj = document.createElement("a");
          const blobKsgj = baseToBlob(res.data.ksgj.replace(/\s+/g, ""), "gps");
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(
              blobKsgj,
              `${sfzmhm}-${lsh}-${kcbh}-${kscj}-${kscs}.gps`
            ); // 地点 科目 序号
            return;
          }
          linkKsgj.style.display = "none";
          linkKsgj.href = URL.createObjectURL(blobKsgj);
          linkKsgj.download = `${sfzmhm}-${lsh}-${kcbh}-${kscj}-${kscs}.gps`;
          document.body.appendChild(linkKsgj);
          linkKsgj.click();
        }
        if (ksxtgj) {
          const linkKsxtgj = document.createElement("a");
          const blobKsxtgj = baseToBlob(
            res.data.ksxtgj.replace(/\s+/g, ""),
            "txt"
          );
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(
              blobKsxtgj,
              `${sfzmhm}-${lsh}-${kcbh}-${kscj}-${kscs}.txt`
            );
            return;
          }
          linkKsxtgj.style.display = "none";
          linkKsxtgj.href = URL.createObjectURL(blobKsxtgj);
          linkKsxtgj.download = `${sfzmhm}-${lsh}-${kcbh}-${kscj}-${kscs}.txt`;
          document.body.appendChild(linkKsxtgj);
          linkKsxtgj.click();
        }
      });
    },

    downloadGps() {
      batchDownloadGps({
        ...this.queryParams,
        startDate: this.date ? this.date[0] : "",
        endDate: this.date ? this.date[1] : "",
        kscxs: this.queryParams.kscxs?.join(),
      }).then((res) => {
        const link = document.createElement("a");
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(res, `考试轨迹.zip`);
          return;
        }
        link.style.display = "none";
        link.href = URL.createObjectURL(res);
        link.download = `考试轨迹.zip`;
        document.body.appendChild(link);
        link.click();
      });
    },

    handleDetail({ ksxh, sfzmhm, kcxh, ksrq }) {
      this.toDady = this.parseTime(new Date(), "{y}-{m}-{d}");
      this.toDady = new Date(this.toDady).getTime();
      this.startTime = new Date(ksrq).getTime();
      this.forms = {};
      if (this.toDady === this.startTime) {
        this.bfOptions = [
          {
            dictLabel: "重新考试",
            dictValue: "0",
          },
          {
            dictLabel: "成绩作废",
            dictValue: "1",
          },
        ];
        this.$set(this.forms, "jyclbb", "0");
      } else {
        this.bfOptions = [
          {
            dictLabel: "成绩作废",
            dictValue: "1",
          },
        ];
        this.$set(this.forms, "jyclbb", "1");
      }
      this.ksxh = ksxh;
      this.photo = [];
      this.tableData = [];
      this.controlPhoto = "";
      this.reportPhoto = "";
      // 查询考试详情
      getExamResultInfo({ ksxh }).then((res) => {
        this.visible = true;
        this.form = res.data;
      });

      getExamViewPhoto(ksxh).then((res) => {
        this.tableData = res.data;
        this.handleItemClick(0);
      });
      // 查询考试项目截图列表
      // getExamViewPhoto(ksxh).then((res) => {
      //   this.tableData = res.data;
      //   Promise.all(
      //     this.tableData.map(({ xmksxh }) => {
      //       return new Promise((resolve) => {
      //         getExamXViewPhoto(xmksxh).then((res) => {
      //           resolve(
      //             res.data
      //               ? res.data.map(
      //                   (url) =>
      //                     `data:image/png;base64,${decodeURIComponent(url.zp)}`
      //                 )
      //               : []
      //           );
      //         });
      //       });
      //     })
      //   ).then((photo) => {
      //     this.photo = photo;
      //   });
      // });

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
    },

    // 列表查看截图
    handleCheckClick(index) {
      this.itemCount = index;
      this.handleItemClick(index);
      this.photoVisible = true;
    },

    // 成绩单预览
    handleExamView() {
      const { href } = this.$router.resolve({
        name: "TranScript",
      });

      this.iframeSrc = `${href}?${this.ksxh}`;
      this.tranScriptVisible = true;
    },

    // 查看全部截图
    handleExamViewPhoto() {
      this.photoVisible = true;
      this.itemCount = 0;
    },

    // 查看视频回放
    handleExamVideoPlay() {
      const { href } = this.$router.resolve({
        name: "VideoPlay",
      });

      window.open(
        `${href}?${this.ksxh}`, //ksxh
        "_blank",
        `fullscreen=no,location=no,width=800,height=${window.screen.availHeight}`
      );
    },
    //异常申请
    exceptionApplication() {
      this.forms.ksxh = this.form.ksxh;
      this.open = true;
      this.resetForm("forms");
    },
    //异常确定
    submitForm(formsShow) {
      this.$refs[formsShow].validate((valid) => {
        if (valid) {
          abnormalApply(this.forms).then(() => {
            this.msgSuccess("添加成功");
            this.getTableList();
            this.open = false;
          });
        }
      });
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
  },
  mounted() {
    getLineSelect().then(({ data }) => {
      this.ksxlList = data;
    });
    this.getTableList();
  },
};
</script>

<style lang="scss" scoped>
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

/deep/.el-image__inner {
  height: auto;
}

.item {
  height: 40px;
  line-height: 40px;
  text-align: left;
  box-sizing: border-box;
  padding-left: 10px;
  border-top: 1px grey solid;
  cursor: pointer;
}

.item-actv {
  background: rgb(0, 47, 255);
  color: white;
}

.wrapper-padding {
  /deep/ .el-dialog__body {
    padding: 0;
  }
}

.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
