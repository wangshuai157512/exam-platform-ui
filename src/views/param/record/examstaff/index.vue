<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="glbm">
        <jaya-select v-model="queryParams.glbm" type="B" />
      </el-form-item>
      <el-form-item prop="ksyzzt">
        <jaya-select
          v-model="queryParams.ksyzzt"
          placeholder="状态"
          @getOptions="getOptions"
          othername="examiner_status"
        />
      </el-form-item>
      <el-form-item prop="xmOrsfzmhm">
        <el-input
          size="small"
          style="width: 180px"
          v-model="queryParams.xmOrsfzmhm"
          placeholder="请输入姓名或身份证"
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
          v-hasPermi="['record:examstaff:add']"
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
      v-loading="tableLoading"
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
        <el-form-item label="考试员序号" prop="ksyxh">
          <el-input
            :disabled="operating == 2"
            v-model="form.ksyxh"
            placeholder="请输入序号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="form.xm" placeholder="姓名" size="small" />
        </el-form-item>
        <el-form-item label="性别" prop="xb">
          <el-select
            clearable
            style="width: 194px"
            v-model="form.xb"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="sex in sexOption"
              :key="sex.value"
              :label="sex.label"
              :value="sex.value"
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
          <el-form-item label="身份证明号码" prop="sfzmhm" v-if="!form.sfzmmc || form.sfzmmc == 'A'">
          <el-input
            v-model="form.sfzmhm"
            placeholder="身份证明号码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="军官证号码" prop="jgz" v-if="form.sfzmmc == 'C'">
          <el-input
            v-model="form.jgz"
            placeholder="军官证号码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="出生日期" prop="csrq">
          <el-date-picker
            size="small"
            value-format="yyyy-MM-dd"
            v-model="form.csrq"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="考试员状态" prop="ksyzzt">
          <jaya-select
            v-model="form.ksyzzt"
            placeholder="状态"
            @getOptions="getOptions"
            othername="examiner_status"
          />
        </el-form-item>
        <el-form-item label="准考车型" prop="zkcx">
          <jaya-select
            multiple
            collapse-tags
            v-model="form.zkcx"
            placeholder="准考车型"
            @getOptions="getOptions"
            othername="exam_car_type"
          />
        </el-form-item>
        <el-form-item label="管理部门" prop="glbm">
          <jaya-select
            type="B"
            :disabled="operating == 2"
            v-model="form.glbm"
          />
        </el-form-item>
        <!-- <el-form-item label="备案信息" prop="value1">
          <el-input v-model="form.roleId" placeholder="备案信息" size="small" />
        </el-form-item> -->

        <el-form-item v-if="operating == 3" label="发证机关" prop="fzjg">
          <jaya-select type="F" v-model="form.fzjg" />
        </el-form-item>
        <el-form-item label="发证单位" prop="fzdw">
          <el-input
            v-model="form.fzdw"
            placeholder="请输入发证单位"
            size="small"
          />
        </el-form-item>
        <el-form-item label="发证日期" prop="fzrq">
          <el-date-picker
            value-format="yyyy-MM-dd"
            size="small"
            v-model="form.fzrq"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="考试员证有效期止" prop="ksyzyxqz">
          <el-date-picker
            value-format="yyyy-MM-dd"
            size="small"
            v-model="form.ksyzyxqz"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="工作单位" prop="gzdw">
          <el-input
            v-model="form.gzdw"
            placeholder="请输入工作单位"
            size="small"
          />
        </el-form-item>
        <el-form-item label="经办人" prop="jbr">
          <el-input
            v-model="form.jbr"
            placeholder="请输入经办人"
            size="small"
          />
        </el-form-item>

        <el-form-item
          v-if="operating == 3 || operating == 2"
          label="创建时间"
          prop="cjsj"
        >
          <el-input
            :disabled="true"
            v-model="form.cjsj"
            placeholder="请输入时间"
            size="small"
          />
        </el-form-item>
        <el-form-item
          v-if="operating == 3 || operating == 2"
          label="更新时间"
          prop="gxsj"
        >
          <el-input
            :disabled="true"
            v-model="form.gxsj"
            placeholder="请输入时间"
            size="small"
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
  examStaffNewAdd,
  examStaffPageList,
  examStaffUpdate,
  examStaffDown,
  examStaffInfo,
} from "@/api/param/record";
const column = function () {
  return [
    {
      title: "管理部门名称",
      width: "150",
      prop: "glbmMc",
    },
    {
      title: "管理部门代码",
      width: "150",
      prop: "glbm",
    },
    {
      title: "姓名",
      width: "120",
      prop: "xm",
    },
    {
      title: "证件号码",
      width: "180",
      prop: "sfzmhm",
    },
    {
      title: "性别",
      width: "60",
      prop: "xb",
      status: () => this.sexOption,
    },
    {
      title: "准考车型",
      width: "150",
      prop: "zkcx",
    },
    {
      title: "考试员证有效期止",
      prop: "ksyzyxqz",
    },
    {
      title: "状态",
      width: "100",
      prop: "ksyzzt",
      status: () => "examiner_status",
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
          auth: ["record:examstaff:detail"],
        },
        {
          title: "修改",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleUpdate,
          auth: ["record:examstaff:edit"],
        },
      ],
    },
  ];
};
export default {
  name: "ExamStaff",
  data() {
    return {
      total: 0,
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      examiner_status: [],
      sexOption: [
        { value: "1", label: "男" },
        { value: "2", label: "女" },
      ],
      rules: {
        // 序号
        ksyxh: [
          { pattern: /^\d{8,9}$/, message: "请输入8位或者9位数字", trigger: "change" },
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        csrq: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        zkcx: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        ksyzzt: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        fzrq: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        glbm: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        ksyzyxqz: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        // fzjg: [
        //   {
        //     required: true,
        //     message: "必填项",
        //     trigger: "change",
        //   },
        // ],
        // 姓名
        xm: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        // 性别
        xb: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        sfzmmc: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        // 身份证明号码
        sfzmhm: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
          {
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "请输入正确的证件号",
            trigger: "change",
          },
        ],
        jgz: [{ required: true, message: "必填项", trigger: "blur" }],
        gzdw: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        fzdw: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        jbr: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
      },
      cartype: [],
      form: {},
      visible: false,
      tableList: [],
      operating: 1, // 新增 1 修改 2 详情3
      title: "新增",
      tableLoading: null,
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    getOptions({ data, type }) {
      this[type] = data;
    },
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      this.tableLoading = true;
      examStaffPageList(this.queryParams).then((res) => {
        this.tableLoading = false;
        this.tableList = res.rows;
        this.total = res.total;
      });
    },

    // 新增
    handleAddVisible() {
      this.operating = 1;
      this.title = "新增";
      this.form = { zkcx: [] };
      this.resetForm("form");
      this.visible = true;
    },

    getDetail(rows) {
      examStaffInfo({ id: rows.ksyxh }).then((res) => {
        this.form = res.data;
        this.form.zkcx = this.form.zkcx.split(",");
        this.visible = true;
      });
    },

    // 修改
    handleUpdate(row) {
      this.operating = 2;
      this.title = "修改";
      this.getDetail(row);
    },

    // 详情
    handleDetail(row) {
      this.operating = 3;
      this.title = "详情";
      this.getDetail(row);
    },

    // 下载
    handleDownload() {
      const { glbm } = this.queryParams;
      if (!glbm) {
        return this.msgWarn("请先选择管理部门");
      }
      examStaffDown({ glbm }).then((res) => {
        this.msgSuccess(res.msg);
      });
    },

    handleSure() {
      this.visible = true;
      if (this.operating !== 3) {
        // 新增，修改 逻辑
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if(this.form.sfzmmc == 'A') {
              this.$set(this.form, 'jgz', undefined)
            }
            if(this.form.sfzmmc == 'C') {
              this.$set(this.form, 'sfzmhm', undefined)
            }
            if (this.operating == 1) {
              const form = { ...this.form, sfzmhm:(this.form.sfzmhm||this.form.jgz), jgz:undefined, };
              form.zkcx && (form.zkcx = form.zkcx.join());
              examStaffNewAdd(form).then(() => {
                this.getTableList();
                this.msgSuccess("新增成功");
              });
            } else {
              const form = {};
              Object.keys(this.form).map((key) => {
                if (this.form[key]) {
                  form[key] = this.form[key];
                }
              });
              form.cjsj = undefined;
              form.fzjg = undefined;
              form.dabh = undefined;
              form.gxsj = undefined;
              form.zkcx = form.zkcx.join();
              examStaffUpdate(form).then(() => {
                this.getTableList();
                this.msgSuccess("修改成功");
              });
            }
            this.visible = false;
          }
        });
      } else {
        this.visible = false;
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
</style>
