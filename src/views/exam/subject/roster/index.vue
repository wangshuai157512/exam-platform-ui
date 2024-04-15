<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <!-- 详情回显问题，先执行组件 -->
      <jaya-select
        v-show="false"
        v-model="detailMsg.ksyy"
        @getOptions="getOptions"
        othername="exam_reason_type"
      >
      </jaya-select>
      <el-form-item>
        <jaya-select type="K" v-model="queryParams.kcxh"></jaya-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-select
          v-model="queryParams.kscx"
          placeholder="考试车型"
          size="small"
          clearable
        >
          <el-option
            v-for="item in kccxList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <jaya-select
          v-model="queryParams.kscxs"
          placeholder="考试车型"
          othername="exam_car_type"
          multiple
          sty="width:200px"
        >
        </jaya-select>
      </el-form-item>
      <el-form-item prop="xm">
        <el-input v-model="queryParams.xm" placeholder="姓名" size="small" />
      </el-form-item>
      <el-form-item prop="sfzh">
        <el-input
          v-model="queryParams.sfzmhm"
          placeholder="身份证号"
          size="small"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="queryParams.ykrq"
          size="small"
          value-format="yyyy-MM-dd"
          placeholder="约考日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="kscc">
        <el-select
          v-model="queryParams.kscc"
          placeholder="考试场次"
          size="small"
          clearable
        >
          <el-option
            v-for="item in ksccList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="yycs">
        <el-select
          v-model="queryParams.yycs"
          placeholder="预约次数"
          size="small"
          clearable
        >
          <el-option
            v-for="item in yycsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="yyzp">
        <el-select
          v-model="queryParams.yyzp"
          placeholder="预约照片"
          size="small"
          clearable
        >
          <el-option
            v-for="item in yyzpList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="mjzp">
        <el-select
          v-model="queryParams.mjzp"
          placeholder="门禁照片"
          size="small"
          clearable
        >
          <el-option
            v-for="item in yyzpList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="kszt">
        <el-select
          v-model="queryParams.kszt"
          placeholder="考生状态"
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
      <el-form-item prop="jxxh">
        <el-select
          v-model="queryParams.jxxh"
          placeholder="培训驾校"
          size="small"
          clearable
        >
          <el-option
            v-for="item in jxxhList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="queryParams.bkyxz" true-label="1" false-label="0"
          >包括已下载</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getTableList(1)"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item class="fun-btn-right">
        <el-button
          type="primary"
          icon="el-icon-arrow-down"
          size="small"
          @click="handleDownLoad"
          v-hasPermi="['exam:subject:roster:downLoad']"
          >下载</el-button
        >
        <!-- <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleExport"
          >导出</el-button
        > -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          v-hasPermi="['exam:subject:roster:add']"
          >添加</el-button
        >
        <el-button
          @click="exelExport"
          icon="el-icon-download"
          size="small"
          type="primary"
          >导出</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :isCalcWidth="true" :data="tableData" style="width: 100%">
      <el-table-column
        prop="kcjc"
        label="考场简称"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="lsh"
        label="流水号"
        :show-overflow-tooltip="true"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="xm"
        label="姓名"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        :show-overflow-tooltip="true"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="sfzmhm"
        label="身份证"
        :show-overflow-tooltip="true"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="kscx"
        label="车型"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="约考日期" align="center" prop="ykrq" width="100">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.ykrq.trim().split(/\s+/)[0]}}</span>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="kszt"
        label="考生状态"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.kszt === "0"
              ? "未报到"
              : scope.row.kszt === "1"
              ? "已报到"
              : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" prop="ksyy" label="考试原因">
        <template slot-scope="scope">
          <span>{{ filterKsyy(scope.row.ksyy) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="kscc"
        label="考试场次"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="yycs"
        label="预约次数"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="ksy1"
        label="考试员"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="yyzp"
        label="预约照片"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.yyzp === "0" ? "无" : scope.row.yyzp === "1" ? "有" : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="mjzp"
        label="门禁照片"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.mjzp === "0" ? "无" : scope.row.mjzp === "1" ? "有" : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.row)"
            v-hasPermi="['exam:subject:roster:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.row)"
            v-hasPermi="['exam:subject:roster:detail']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="approve(scope.row)"
            v-hasPermi="['exam:subject:roster:approve']"
            :disabled="scope.row.ykrq !== parseTime(new Date(), '{y}-{m}-{d}')"
            >认证</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="report(scope.row)"
            v-hasPermi="['exam:subject:roster:report']"
            :disabled="scope.row.kszt === '1'"
            >报到</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getTableList"
    />

    <!-- 添加考生弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加考生预约信息"
      :visible.sync="openAdd"
      width="680px"
      append-to-body
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        :inline="true"
        class="dialogForm"
      >
        <el-form-item label="流水号" prop="lsh">
          <el-input
            class="inp"
            v-model="form.lsh"
            placeholder="请输入流水号"
            size="small"
          >
            <template slot="prepend">00000</template></el-input
          >
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
        <el-form-item label="证件名称" prop="sfzmmc">
          <jaya-select
            v-model="form.sfzmmc"
            placeholder="证件名称"
            @getOptions="getOptions"
            othername="card_type"
          />
        </el-form-item>
        <el-form-item
          label="身份证明号码"
          prop="sfzmhm"
          v-if="!form.sfzmmc || form.sfzmmc == 'A'"
        >
          <el-input
            v-model="form.sfzmhm"
            placeholder="身份证明号码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="军官证号码" prop="jgz" v-if="form.sfzmmc == 'C'">
          <el-input v-model="form.jgz" placeholder="军官证号码" size="small" />
        </el-form-item>
        <el-form-item label="准考证明编号" prop="zkzmbh">
          <el-input
            v-model="form.zkzmbh"
            placeholder="请输入准考证明编号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="约考日期" prop="ykrq">
          <el-date-picker
            v-model="form.ykrq"
            size="small"
            type="date"
            placeholder="约考日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="准驾车型" prop="kscx">
          <jaya-select v-model="form.kscx" othername="exam_car_type">
          </jaya-select>
        </el-form-item>
        <el-form-item label="考场简称" prop="kcxh">
          <jaya-select type="K" v-model="form.kcxh" />
        </el-form-item>
        <el-form-item label="考试原因" prop="ksyy">
          <jaya-select
            v-model="form.ksyy"
            @getOptions="getOptions"
            othername="exam_reason_type"
          >
          </jaya-select>
        </el-form-item>
        <el-form-item label="预约次数" prop="yycs">
          <el-select v-model="form.yycs" placeholder="请选择" size="small">
            <el-option
              v-for="item in yycsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试场次" prop="kscc">
          <el-select
            v-model="form.kscc"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in ksccList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
        <el-button @click="openAdd = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="考试名单详情"
      :visible.sync="openDetail"
      width="980px"
      append-to-body
    >
      <el-form
        :model="detailMsg"
        :rules="rules"
        ref="form"
        :inline="true"
        class="dialogForm"
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
            <div class="imgBox">
              <img
                :src="'data:image/jpeg;base64,' + mjzpUrl"
                alt=""
                v-if="mjzpUrl"
              />
              <img
                src="../../../../assets/images/default-img.png"
                alt=""
                v-else
              />
              <h6>门禁照片</h6>
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
                <el-form-item label="姓名" prop="xm">
                  <el-input
                    v-model="detailMsg.xm"
                    type="text"
                    placeholder="请输入内容"
                    style="margin-top: 10px; width: 100px"
                    :disabled="isdetils"
                  />
                </el-form-item>
              </li>
              <li>
                <label>性别</label>
                <span>{{ detailMsg.xb === "1" ? "男" : "女" }}</span>
              </li>
              <li>
                <label>证件名称</label>
                <span>居民身份证</span>
              </li>
              <li>
                <label>证件号码</label>
                <span>{{ detailMsg.sfzmhm }}</span>
              </li>
              <li>
                <label>预约日期</label>
                <span>{{
                  detailMsg.yyrq ? detailMsg.yyrq.split(/\s+/)[0] : ""
                }}</span>
              </li>
              <li>
                <label>约考日期</label>
                <span>{{
                  detailMsg.ykrq ? detailMsg.ykrq.split(/\s+/)[0] : ""
                }}</span>
              </li>
              <li>
                <label>考试科目</label>
                <span>科目{{ detailMsg.kskm === "2" ? "二" : "三" }}</span>
              </li>
              <li>
                <label>考车号牌</label>
                <span>{{ detailMsg.hphm }}</span>
              </li>
              <li>
                <label>考试车型</label>
                <span>{{ detailMsg.kscx }}</span>
              </li>
              <li>
                <label>预约次数</label>
                <span>{{ detailMsg.yycs }}</span>
              </li>
              <li>
                <label>考试原因</label>
                <span>{{ detailMsg.ksyy }}</span>
              </li>
              <li>
                <label>考场简称</label>
                <span>{{ detailMsg.ksdd }}</span>
              </li>
              <li>
                <label>管理部门名称</label>
                <span>{{ detailMsg.glbm }}</span>
              </li>
              <li>
                <label>培训驾校</label>
                <span :title="detailMsg.dlr">{{ detailMsg.dlr }}</span>
              </li>
              <li>
                <label>考试状态</label>
                <span>{{ detailMsg.zt === "1" ? "已报到" : "未报到" }}</span>
              </li>
              <li>
                <label>更新时间</label>
                <span>{{ detailMsg.gxsj }}</span>
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
      </el-form>
      <div slot="footer" class="footer" v-if="!isdetils">
        <el-button type="primary" @click="submitEdit">确 定</el-button>
        <el-button @click="openDetail = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  rosterList,
  rosterExport,
  rosterAdd,
  applyPhoto,
  entrancePhoto,
  rosterDetail,
  rosterApprove,
  rosterDownLoad,
  drvSchool,
  examRoomSelect,
  preasignReport,
  examineeupdate,
} from "@/api/exam/examSubject";
import { exce } from "../statistics/mixin";
const exelColumn = function () {
  return [
    {
      title: "身份证",
      width: "380",
      prop: "sfzmhm",
    },
    {
      title: "姓名",
      width: "150",
      prop: "xm",
    },
    {
      title: "性别",
      width: "120",
      prop: "excelXb",
    },
    {
      title: "考场简称",
      prop: "kcjc",
      width: "120",
    },
    {
      title: "流水号",
      prop: "lsh",
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
      title: "考生状态",
      width: "120",
      prop: "excelKszt",
    },
    {
      title: "考试场次",
      width: "120",
      prop: "kscc",
    },
    {
      title: "预约次数",
      width: "120",
      prop: "yycs",
    },
  ];
};
export default {
  name: "roster",
  mixins: [exce],
  data() {
    return {
      exelColumn: exelColumn.call(this),
      exelTableList: [],
      barData: {
        textTitle: "考试名单",
      },
      // 列表数据
      tableData: [],
      total: 0,
      // 新增弹窗
      openAdd: false,
      // 详情弹窗
      openDetail: false,
      // 详情信息
      detailMsg: {},
      bmzpUrl: "", //报名zp
      mjzpUrl: "", //门禁zp
      operating: 1, // 新增 1 修改 2 详情3
      // 查询参数
      queryParams: {
        // kskm: '',
        // kcxh: '',
        kscxs: "",
        // xm: "",
        // sfzmhm: "",
        ykrq: this.parseTime(new Date(), "{y}-{m}-{d}"),
        // kscc:"",
        // yycs: "",
        // yyzp: "",
        // kszt: '',
        // jxxh: '', //培训驾校为驾校序号
        bkyxz: "0",
        pageSize: 20,
        pageNum: 1,
      },
      kccxList: [],
      ksccList: [],
      yycsList: [
        {
          label: "5",
          value: "5",
        },
        {
          label: "4",
          value: "4",
        },
        {
          label: "3",
          value: "3",
        },
        {
          label: "2",
          value: "2",
        },
        {
          label: "1",
          value: "1",
        },
      ],
      yyzpList: [
        {
          label: "无",
          value: "0",
        },
        {
          label: "有",
          value: "1",
        },
      ],
      ksztList: [
        {
          label: "未报到",
          value: "0",
        },
        {
          label: "已报到",
          value: "1",
        },
      ],
      jxxhList: [], //培训驾校
      // 表单参数
      form: {},
      forms: {},
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
      ksyyList: [],
      ksyList: [], //考试员
      isdetils: true,
      // 表单校验
      rules: {
        kcxh: [{ required: true, message: "必填项", trigger: "change" }],
        kscx: [{ required: true, message: "必填项", trigger: "change" }],
        ksyy: [{ required: true, message: "必填项", trigger: "change" }],
        lsh: [
          {
            required: true,
            pattern: /^[0-9]{8}$/,
            message: "请输入8位数字",
            trigger: "change",
          },
        ],
        sfzmmc: [{ required: true, message: "必填项", trigger: "change" }],
        sfzmhm: [
          { required: true, message: "必填项", trigger: "change" },
          {
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "请输入正确的证件号",
            trigger: "change",
          },
        ],
        xb: [{ required: true, message: "必填项", trigger: "change" }],
        xm: [{ required: true, message: "必填项", trigger: "blur" }],
        jgz: [{ required: true, message: "必填项", trigger: "blur" }],
        ykrq: [{ required: true, message: "必填项", trigger: "change" }],
        zkzmbh: [
          { required: true, message: "必填项", trigger: "change" },
          { min: 12, max: 12, message: "准考证必须为12位", trigger: "change" },
        ],
        yycs: [{ required: true, message: "必填项", trigger: "change" }],
      },
    };
  },
  created() {
    drvSchool().then((res) => {
      this.jxxhList = res.data;
    });
    // 考试场次下拉接口
    examRoomSelect({ kcxh: "" }).then((res) => {
      // 处理传参要label
      if (res.data.length > 0) {
        res.data.forEach((item) => {
          item.value = item.label;
        });
      }
      this.ksccList = res.data;
    });
    this.getTableList();
  },
  methods: {
    // 报道
    report({ ksdd, kskm, sfzmhm, ykrq }) {
      console.log(ksdd, kskm, sfzmhm, ykrq);
      this.$confirm("确定要报道吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        preasignReport({ sfzmhm, ykrq, ksdd, kskm }).then((res) => {
          if (res.code == 200) {
            this.getTableList();
            this.$message({
              type: "success",
              message: "报道成功!",
            });
          }
        });
      });
    },
    filterKsyy(key) {
      return this.ksyyList.find((item) => item.value == key)?.label;
    },
    // 考试原因数据
    getOptions({ data, type }) {
      if (type === "exam_reason_type") {
        this.ksyyList = data;
      }
    },
    /** 查询名单列表 */
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      let queryVehicles = this.queryParams.kscxs + "";
      rosterList({ ...this.queryParams, kscxs: queryVehicles }).then((res) => {
        res.rows.forEach((item) => {
          if (item.xb === "1") {
            item.sex = "男";
          } else if (item.xb === "2") {
            item.sex = "女";
          }
        });
        this.tableData = res.rows;
        this.total = res.total;
      });
      let { pageNum, pageSize, ...excelQuery } = this.queryParams;
      rosterExport({
        ...excelQuery,
        kscxs: queryVehicles,
      }).then((res) => {
        res.data.forEach((item) => {
          if (item.kszt == 1) {
            item.excelKszt = "已报到";
          } else if (item.kszt == 0) {
            item.excelKszt = "未报到";
          }
          if (item.xb == 1) {
            item.excelXb = "男";
          } else if (item.xb == 2) {
            item.excelXb = "女";
          }
        });
        this.exelTableList = res.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.openAdd = true;
    },
    //编辑
    handleEdit(row) {
      let { sfzmhm, kcxh, ykrq, ksdd, kskm } = row;
      rosterDetail({ sfzmhm, ykrq, ksdd, kskm }).then((res) => {
        this.isdetils = false;
        this.openDetail = true;
        if (res.data) {
          this.detailMsg = res.data;
          this.ksyyList.forEach((item) => {
            if (item.value === this.detailMsg.ksyy) {
              this.detailMsg.ksyy = item.label;
            }
          });
        }
      });
    },
    submitEdit() {
      const { lsh, xm, ykrq, kskm } = this.detailMsg;
      examineeupdate({ lsh, newName: xm, ykrq, kskm }).then(() => {
        this.getTableList();
        this.msgSuccess("修改成功");
        this.openDetail = false;
      });
    },
    //详情==查看
    handleDetail(row) {
      this.isdetils = true;
      this.detailMsg = {};
      this.bmzpUrl = "";
      this.mjzpUrl = "";
      this.openDetail = true;
      let { sfzmhm, kcxh, ykrq, ksdd, kskm } = row;
      rosterDetail({ sfzmhm, ykrq, ksdd, kskm }).then((res) => {
        if (res.data) {
          this.detailMsg = res.data;
          this.ksyyList.forEach((item) => {
            if (item.value === this.detailMsg.ksyy) {
              this.detailMsg.ksyy = item.label;
            }
          });
        }
      });
      applyPhoto(sfzmhm).then((res) => {
        this.bmzpUrl = res.data?.zp;
      });
      let entranceParams = `${kcxh}/${sfzmhm}/${ykrq}`.replace(/\s*/g, "");
      entrancePhoto(entranceParams).then((res) => {
        this.mjzpUrl = res.data?.zp;
      });
    },
    // 认证
    approve(row) {
      this.$confirm("确定要人工添加身份认证么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        let { sfzmhm, ykrq, ksdd, kskm } = row;
        rosterApprove({ sfzmhm, ykrq, ksdd, kskm }).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "认证成功!",
            });
          }
        });
      });
    },
    // handleExport() {
    //   console.log("这是导出");
    // },
    handleDownLoad() {
      let { kcxh, ykrq, sfzmhm } = this.queryParams;
      if (!kcxh || !ykrq) {
        this.$message({
          message: !kcxh ? "请选择考场" : "请选择约考日期",
          type: "warning",
        });
        return;
      }
      rosterDownLoad({ kcxh, ykrq, sfzmhm }).then((res) => {
        this.$message({
          message: "下载成功",
          type: "success",
        });
      });
    },
    /** 添加 */
    submitAddForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.sfzmmc == "A") {
            this.$set(this.form, "jgz", undefined);
          }
          if (this.form.sfzmmc == "C") {
            this.$set(this.form, "sfzmhm", undefined);
          }
          const { lsh } = this.form;
          rosterAdd({
            ...this.form,
            sfzmhm: this.form.sfzmhm || this.form.jgz,
            jgz: undefined,
            lsh: `00000${lsh}`,
          }).then((res) => {
            if (res.code == 200) {
              this.msgSuccess("添加成功");
              this.openAdd = false;
              this.getTableList();
            }
          });
        }
      });
    },
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
    width: 840px;
    padding-left: 20px;
    box-sizing: border-box;
    ul {
      li {
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;
        width: 22%;
        margin-bottom: 20px;
        span {
          display: block;
          width: 100%;
          background-color: #f5f7fa;
          border: 1px solid #dfe4ed;
          margin-top: 10px;
          height: 32px;
          line-height: 32px;
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
/deep/.el-input-group__prepend {
  padding-left: 15px;
  padding-right: 0;
}

/deep/ .inp {
  .el-input__inner {
    padding-left: 0;
    width: 142px;
  }
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
.footer {
  // position: relative;
  // margin-top: 500px;
}
</style>
