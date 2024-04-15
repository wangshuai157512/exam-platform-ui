<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh" placeholder="考场名称">
        <jaya-select v-model="queryParams.kcxh" type="K" />
      </el-form-item>
      <el-form-item prop="sbxh" placeholder="监控设备">
        <jaya-select v-model="queryParams.sbxh" type="J" />
      </el-form-item>
      <el-form-item prop="splx">
        <el-select
          v-model="queryParams.splx"
          placeholder="视频类型"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="status in splxList"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="spmc">
        <el-input
          v-model="queryParams.spmc"
          placeholder="视频名称"
          size="small"
        ></el-input>
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
          icon="el-icon-plus"
          size="small"
          type="primary"
          v-hasPermi="['rediomanger:video:add']"
          >添加</el-button
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

    <!--添加弹框信息-->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="openBtnAdd"
      width="680px"
      append-to-body
      :destroy-on-close="true"
      v-if="openBtnAdd"
    >
      <el-form
        class="dialogForm"
        :disabled="operating == 3"
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
      >
        <el-form-item label="考场名称" prop="kcxh" style="width: 194px">
          <jaya-select v-model="form.kcxh" type="K" />
        </el-form-item>
        <el-form-item label="设备名称" prop="sbxh" style="width: 194px">
          <jaya-select :parameter="form.kcxh" v-model="form.sbxh" type="J" />
        </el-form-item>

        <el-form-item label="视频通道" prop="tdh">
          <el-input
            v-model="form.tdh"
            placeholder="请输入视频通道"
            size="small"
          />
        </el-form-item>
        <el-form-item label="视频名称" prop="spmc">
          <el-input
            v-model="form.spmc"
            placeholder="请输入视频名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="视频类型" prop="splx">
          <el-select
            v-model="form.splx"
            placeholder="视频类型"
            clearable
            size="small"
          >
            <el-option
              v-for="status in splxList"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="语音" prop="yy">
          <el-select
            style="width: 194px"
            v-model="form.yy"
            placeholder="请选择语音"
            size="small"
          >
            <el-option
              v-for="status in yyOption"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="云台" prop="yt">
          <el-select
            style="width: 194px"
            v-model="form.yt"
            placeholder="请选择云台"
            size="small"
          >
            <el-option
              v-for="status in ytOption"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="zt">
          <el-select
            style="width: 194px"
            v-model="form.zt"
            placeholder="请选择状态"
            size="small"
          >
            <el-option
              v-for="status in ztOption"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视频顺序号" prop="spsxh">
          <el-select
            style="width: 194px"
            v-model="form.spsxh"
            placeholder="请选择视频顺序号"
            size="small"
          >
            <el-option
              v-for="status in spsxhOption"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目区域码" prop="xmqym">
          <el-input
            v-model="form.xmqym"
            placeholder="请输入视频区域码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input
            style="width: 602px"
            type="textarea"
            placeholder="请输入内容"
            v-model="form.bz"
            maxlength="64"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSure('form')">确 定</el-button>
        <el-button @click="openBtnAdd = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--编辑弹框信息-->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="bianjivisible"
      width="680px"
      append-to-body
    >
      <el-form
        class="dialogForm"
        :disabled="operating == 3"
        :model="forms"
        ref="forms"
        :inline="true"
        :rules="rules"
      >
        <el-form-item label="视频序号" prop="spxh">
          <el-input
            style="width: 194px"
            v-model="forms.spxh"
            size="small"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="考场名称" prop="kcxh" style="width: 194px">
          <jaya-select v-model="forms.kcxh" type="K" />
        </el-form-item>
        <el-form-item label="设备名称" prop="sbxh" style="width: 194px">
          <jaya-select :parameter="forms.kcxh" v-model="forms.sbxh" type="J" />
        </el-form-item>

        <el-form-item label="视频通道" prop="tdh">
          <el-input
            v-model="forms.tdh"
            placeholder="请输入视频通道"
            size="small"
            style="width: 194px"
          />
        </el-form-item>
        <el-form-item label="视频名称" prop="spmc">
          <el-input
            v-model="forms.spmc"
            placeholder="请输入视频名称"
            size="small"
            style="width: 194px"
          />
        </el-form-item>
        <el-form-item label="视频类型" prop="splx">
          <el-select
            v-model="queryParams.splx"
            placeholder="视频类型"
            clearable
            size="small"
            style="width: 194px"
          >
            <el-option
              v-for="status in splxList"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
          <!-- <jaya-select
            style="width: 194px"
            v-model="forms.splx"
            placeholder="请选择视频类型"
            size="small"
            @getOptions="getOptions"
            othername="vidchannel_type"
            v-show="false"
          />
          <el-select 
          v-model="forms.splx" 
          placeholder="视频类型" 
          size="small">
            <el-option
              v-for="status in splxList"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="语音" prop="yy">
          <el-select
            style="width: 194px"
            v-model="forms.yy"
            placeholder="请选择语音"
            size="small"
          >
            <el-option
              v-for="status in yyOption"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="云台" prop="yt">
          <el-select
            style="width: 194px"
            v-model="forms.yt"
            placeholder="请选择云台"
            size="small"
          >
            <el-option
              v-for="status in ytOption"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="zt">
          <el-select
            style="width: 194px"
            v-model="forms.zt"
            placeholder="请选择状态"
            size="small"
          >
            <el-option
              v-for="status in ztOption"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视频顺序号" prop="spsxh">
          <el-select
            style="width: 194px"
            v-model="forms.spsxh"
            placeholder="请选择视频顺序号"
            size="small"
          >
            <el-option
              v-for="status in spsxhOption"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目区域码" prop="xmqym">
          <el-input
            v-model="forms.xmqym"
            placeholder="请输入视频区域码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input
            style="width: 602px"
            type="textarea"
            placeholder="请输入内容"
            v-model="forms.bz"
            maxlength="64"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bainjihandleSure('forms')"
          >确 定</el-button
        >
        <el-button @click="bianjivisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--关联弹框-->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="glvisible"
      width="680px"
      append-to-body
      v-if="glvisible && ksxmlist.length > 0"
    >
      <el-form
        class="dialogForm"
        :model="formGlid"
        ref="formGlid"
        :inline="true"
        :rules="rules"
      >
        <el-form-item v-if="videoType == 'F'" prop="ksxmlist">
          <div v-for="(item, i) in ksxmlist" :key="i">
            <el-radio-group v-model="formGlid.glid">
              <el-radio
                :class="[{ active: jtem.currentFlag == 2 }]"
                :label="jtem.value"
                v-for="(jtem, j) in item"
                :key="j"
                style="margin: 10px"
                @change="setGlid(jtem.value)"
                >{{ jtem.label }}</el-radio
              >
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item v-if="videoTypeAitem == 'A'" prop="ksxmlist">
          <div v-for="(item, i) in ksxmlist" :key="i">
            <el-radio-group v-model="formGlid.glid">
              <el-radio
                :label="jtem.value"
                v-for="(jtem, j) in item"
                :key="j"
                style="margin: 10px"
                @change="setGlid(jtem.value)"
                >{{ jtem.label }}</el-radio
              >
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item v-else prop="cxlist">
          <div v-for="(item, index) in cxlist" :key="index">
            <p>{{ item.syzjcx }}</p>
            <el-radio-group v-model="formGlid.glid">
              <el-radio
                :label="k.value"
                v-for="(k, i) in item.carList"
                :key="i"
                style="margin: 10px"
                @change="setGlid(k.value)"
                >{{ k.label }}</el-radio
              >
            </el-radio-group>
          </div>
        </el-form-item>
        <div>
          <span style="color: red; margin-left: 20px; font-size: 12px"
            >*红色字体为已关联过的项目 </span
          >
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="glSure('form')">保 存</el-button>
        <el-button @click="glvisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--删除弹窗-->
    <!-- <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="scvisible" width="680px">
      <span>你确定要将此信息删除吗</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dealDetail">确 定</el-button>
        <el-button @click="scvisible = false">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<!--表头信息-->
<script>
import {
  videoadd,
  videomation,
  videolist,
  videodel,
  videoup,
  videoguanlian,
  jkselect,
  spksxmselect,
  lxselect,
  cxselect,
  cancelconnectionvideo,
} from "@/api/param/rediomanger";
const column = function () {
  return [
    {
      title: "考场简称",
      prop: "kcjc",
    },
    {
      title: "设备名称",
      prop: "sbmc",
    },
    {
      title: "通道号",
      prop: "tdh",
    },
    {
      title: "视频名称",
      prop: "spmc",
    },
    {
      title: "视频类型",
      prop: "splx",
      status: () => this.splxList,
    },
    {
      title: "语音",
      width: "150",
      prop: "yy",
      status: () => this.yyOption,
    },
    {
      title: "关联说明",
      prop: "glsm",
    },
    {
      title: "状态",
      prop: "zt",
      status: () => this.ztOption,
    },
    {
      title: "视频顺序号",
      prop: "spsxh",
      status: () => this.spsxhOption,
    },
    {
      title: "项目区域码",
      prop: "xmqym",
    },

    {
      title: "操作",
      width: "200",
      type: "buttons",
      prop: "roleId",
      butList: [
        {
          title: "详情",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.xiangqinghandle,
          auth: ["rediomanger:video:details"],
        },
        {
          title: "编辑",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleDetail,
          auth: ["rediomanger:video:edit"],
        },

        {
          title: "关联",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.glDetail,
          auth: ["rediomanger:video:relation"],
        },
        {
          title: "取消关联",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.glCancel,
          auth: ["rediomanger:video:disassociate"],
        },
        /*{
        title: "删除",
        size: "mini",
        disabled: false,
        condition: "1",
        onClick: this.dealDetail
      },*/
      ],
    },
  ];
};
export default {
  name: "ExamRoom",
  data() {
    return {
      total: 0,
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        kcxh: "",
        splx: "",
      },

      splxList: [
        { value: "A", label: "全景" },
        // { value: "B", label: "报道" },
        // { value: "C", label: "车载" },
        // { value: "D", label: "考台" },
        // { value: "E", label: "视频认证" },
        { value: "F", label: "考试项目" },
        // { value: "G", label: "追踪" },
        // { value: "H", label: "候考区" },
        // { value: "I", label: "视频解码" },
        // { value: "J", label: "对讲" },
        // { value: "W", label: "车外" },
      ],
      yyOption: [
        { value: "1", label: "支持" },
        { value: "0", label: "不支持" },
      ],
      ytOption: [
        { value: "1", label: "支持" },
        { value: "0", label: "不支持" },
      ],
      ztOption: [
        { value: "1", label: "正常" },
        { value: "0", label: "停用" },
      ],
      ISDEFAULTOption: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
      spsxhOption: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "13", label: "13" },
        { value: "14", label: "14" },
        { value: "15", label: "15" },
      ],
      jlsblist: [],
      ksxmlist: [],
      cxlist: [],
      rules: {
        kcxh: [{ required: true, trigger: "blur", message: "必填项" }],
        sbxh: [{ required: true, trigger: "blur", message: "必填项" }],
        spmc: [{ required: true, trigger: "blur", message: "必填项" }],
        splx: [{ required: true, trigger: "blur", message: "必填项" }],
        spxh: [{ required: true, trigger: "blur", message: "必填项" }],
        tdh: [
          { pattern: /^\d+$/, message: "请输入数字" },
          { required: true, trigger: "blur", message: "必填项" },
        ],
        yt: [{ required: true, trigger: "blur", message: "必填项" }],
        yy: [{ required: true, trigger: "blur", message: "必填项" }],
        zt: [{ required: true, trigger: "blur", message: "必填项" }],
        spsxh: [{ required: true, trigger: "blur", message: "必填项" }],
        xmqym: [{ required: true, trigger: "blur", message: "必填项" }],
        // bz: [
        //   {
        //     // pattern: /^(*{0,64})/,
        //     // message: "不能超过64位字符",
        //   },
        // ],
      },
      cartype: [],
      tableList: [],
      form: {},
      formGlid: {
        glid: "",
        spxh: "",
      },
      forms: {},
      visible: false,
      openBtnAdd: false,
      ckspvisible: false,
      glvisible: false,
      scvisible: false,
      bianjivisible: false,
      operating: 1, //添加1 编辑2 详情3
      videoType: "F",
      videoTypeAitem: "A",
      title: "",
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    // getOptions({ data, type }) {
    //   if (type == "vidchannel_type") {
    //     data.forEach((item) => {
    //       if (item.value === "A" || item.value === "F") {
    //         this.splxList.push(item);
    //       }
    //     });
    //   }
    // },
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      videolist(this.queryParams).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
      });
    },
    //详情
    xiangqinghandle(row) {
      this.form = {};
      const rows = { ...row };
      this.operating = 3;
      this.title = "详情";
      this.form = rows;
      this.openBtnAdd = true;
    },

    // 新增信息方法
    handleAddVisible() {
      this.form = {};
      this.operating = 1;
      this.title = "添加视频";
      this.openBtnAdd = true;
    },

    // 编辑方法
    handleDetail(row) {
      this.forms = {};
      this.operating = 2;
      this.title = "编辑视频";
      this.bianjivisible = true;
      let { kcxh, sbxh, splx, spmc, spsxh, spxh, tdh, yt, yy, zt, bz, xmqym } =
        row;
      this.forms = {
        kcxh,
        sbxh,
        splx,
        spmc,
        spsxh,
        spxh,
        tdh,
        yt,
        yy,
        zt,
        bz,
        xmqym,
      };
    },
    //删除方法
    dealDetail() {
      this.title = "提示";
      this.scvisible = true;
    },
    //查看视频方法
    videoDetail() {
      this.title = "查看视频";
      this.ckspvisible = true;
    },
    setGlid(val) {
      this.formGlid.glid = val;
    },
    //关联方法
    glDetail(row) {
      this.currentlySelected = row.clxh;
      this.title =
        this.splxList.find((status) => status.value == row.splx)?.label +
        "视频关联";
      this.glvisible = true;
      this.formGlid.spxh = row.spxh;
      this.formGlid.glid = row.clxh;
      this.videoType = row.splx;
      this.videoTypeAitem = row.splx;
      this.ksxmlist = [];
      //考试项目
      if (row.splx === "F") {
        const { kcxh, spxh } = row;
        spksxmselect({ kcxh, qjbs: 0, spxh }).then((res) => {
          this.ksxmlist = res.data;
          if (this.ksxmlist.length < 1) {
            // alert("未查询到该考场的考试项目配置信息");
            this.$message({
              message: "未查询到该考场的考试项目配置信息",
              type: "warning",
            });
          }
        });
        //全景
      } else if (row.splx === "A") {
        const { kcxh, spxh } = row;
        spksxmselect({ kcxh, qjbs: 1, spxh }).then((res) => {
          this.ksxmlist = res.data;
          if (this.ksxmlist.length < 1) {
            // alert("未查询到该考场的考试项目配置信息");
            this.$message({
              message: "未查询到该考场的考试项目配置信息",
              type: "warning",
            });
          }
        });
      } else {
        let { kcxh } = row;
        cxselect({ kcxh }).then((res) => {
          this.cxlist = res.data;
        });
        lxselect({ kcxh }).then((res) => {
          this.ksxmlist = res.data;
        });
      }
    },
    //关联保存按钮
    glSure() {
      this.glvisible = true;
      // this.form.kcxh = undefined;
      this.formGlid.sbxh = undefined;
      this.formGlid.tdh = undefined;
      if (this.formGlid.glid == this.currentlySelected) {
        this.$message({
          message: "设备已经绑定该视频",
          type: "warning",
        });
      } else {
        videoguanlian(this.formGlid).then((res) => {
          this.msgSuccess("关联成功");
          this.getTableList();
        });
      }
      this.glvisible = false;
    },
    //取消关联
    glCancel(row) {
      let { spxh } = row;
      this.$confirm("是否取消关联", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelconnectionvideo({ spxh }).then((res) => {
            this.getTableList();
          });
          this.$message({
            type: "success",
            message: "取消成功!",
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   // message: '未取消'
          // });
        });
    },

    //编辑确定按钮验证
    bainjihandleSure(formUpdate) {
      this.$refs[formUpdate].validate((valid) => {
        if (this.operating == 2) {
          videoup({
            ...this.forms,
            ...{ tdh: Number(this.forms.tdh) },
          }).then(() => {
            this.getTableList();
            this.msgSuccess("修改成功");
          });
          this.bianjivisible = false;
        }
      });
    },

    //添加功能确定按钮
    handleSure(formName) {
      if (this.operating !== 3) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.operating == 1) {
              videoadd({
                ...this.form,
                ...{ tdh: Number(this.form.tdh) },
              }).then(() => {
                this.getTableList();
                this.msgSuccess("添加成功");
              });
            }
            this.openBtnAdd = false;
          }
        });
      } else {
        this.openBtnAdd = false;
      }
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
.active {
  /deep/ .el-radio__label {
    color: red;
  }
}
</style>