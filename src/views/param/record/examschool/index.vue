<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <!-- <el-form-item prop="name">
        <jaya-select type="B" v-model="queryParams.name" />
      </el-form-item> -->
      <el-form-item prop="glbm">
        <jaya-select v-model="queryParams.glbm" type="B" />
      </el-form-item>
      <el-form-item prop="jxdm">
        <el-input
          size="small"
          v-model="queryParams.jxdm"
          placeholder="驾校代码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="jxmc">
        <el-input
          size="small"
          v-model="queryParams.jxmc"
          placeholder="驾校名称"
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
          v-hasPermi="['record:examschool:add']"
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
        <el-form-item label="驾校序号" prop="jxxh">
          <el-input
            :disabled="operating == 2"
            v-model="form.jxxh"
            placeholder="请输入序号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="驾校代码" prop="jxdm">
          <el-input
            :disabled="operating == 2"
            v-model="form.jxdm"
            placeholder="驾校代码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="管理部门" prop="glbm">
          <jaya-select
            type="B"
            :disabled="operating == 2"
            v-model="form.glbm"
          />
        </el-form-item>
        <el-form-item label="驾校名称" prop="jxmc">
          <el-input
            :disabled="operating == 2"
            v-model="form.jxmc"
            placeholder="驾校名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="驾校简称" prop="jxjc">
          <el-input v-model="form.jxjc" placeholder="驾校简称" size="small" />
        </el-form-item>
        <el-form-item label="驾校地址" prop="jxdz">
          <el-input v-model="form.jxdz" placeholder="驾校地址" size="small" />
        </el-form-item>
        <el-form-item label="法人代表" prop="frdb">
          <el-input v-model="form.frdb" placeholder="法人代表" size="small" />
        </el-form-item>
        <el-form-item label="注册资金" prop="zczj">
          <el-input v-model="form.zczj" placeholder="注册资金" size="small" />
        </el-form-item>
        <el-form-item label="驾校级别" prop="jxjb">
          <jaya-select
            v-model="form.jxjb"
            placeholder="驾校级别"
            @getOptions="getOptions"
            othername="school_level"
          />
        </el-form-item>
        <!-- <el-form-item label="考试员证有效期止" prop="value1">
          <el-date-picker
            size="small"
            v-model="form.value1"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item> -->

        <el-form-item label="联系人" prop="lxr">
          <el-input v-model="form.lxr" placeholder="联系人" size="small" />
        </el-form-item>
        <el-form-item label="联系电话" prop="lxdh">
          <el-input v-model="form.lxdh" placeholder="联系电话" size="small" />
        </el-form-item>
        <el-form-item label="驾校状态" prop="jxzt">
          <jaya-select
            v-model="form.jxzt"
            placeholder="驾校状态"
            @getOptions="getOptions"
            othername="school_status"
          />
        </el-form-item>
        <el-form-item label="培训准驾车型" prop="zjcx">
          <jaya-select
            class="asd"
            sty="width:602px"
            multiple
            v-model="form.zjcx"
            placeholder="培训准驾车型"
            @getOptions="getOptions"
            othername="exam_car_type"
          />
        </el-form-item>
        <el-form-item label="审核人" prop="reviewer">
          <el-input v-model="form.reviewer" placeholder="审核人" size="small" />
        </el-form-item>
        <el-form-item v-if="operating != 1" label="创建时间" prop="cjsj">
          <el-date-picker
            value-format="yyyy-MM-dd"
            :disabled="true"
            type="date"
            size="small"
            v-model="form.cjsj"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item v-if="operating != 1" label="更新时间" prop="gxsj">
          <el-date-picker
            value-format="yyyy-MM-dd"
            :disabled="true"
            type="date"
            size="small"
            v-model="form.gxsj"
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
  examSchoolPageList,
  examSchoolNewAdd,
  examSchoolInfo,
  examSchoolUpdate,
  drvSchoolDownLoad,
} from "@/api/param/record";
const column = function () {
  return [
    {
      title: "驾校序号",
      width: "100",
      prop: "jxxh",
    },
    {
      title: "驾校代码",
      width: "150",
      prop: "jxdm",
    },
    {
      title: "驾校名称",
      width: "150",
      prop: "jxmc",
    },
    {
      title: "驾校简称",
      width: "150",
      prop: "jxjc",
    },
    {
      title: "联系人",
      width: "150",
      prop: "lxr",
    },
    {
      title: "联系电话",
      width: "150",
      prop: "lxdh",
    },
    {
      title: "驾校级别",
      width: "100",
      prop: "jxjb",
      status: () => "school_level",
    },
    {
      title: "培训准驾车型",
      width: "150",
      prop: "zjcx",
    },
    {
      title: "管理部门名称",
      prop: "glbmMc",
    },
    {
      title: "驾校状态",
      width: "100",
      prop: "jxzt",
      status: () => "school_status",
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
          auth: ["record:examschool:detail"],
        },
        {
          title: "修改",
          size: "mini",
          disabled: false,
          condition: "1",
          onClick: this.handleUpdate,
          auth: ["record:examschool:edit"],
        },
      ],
    },
  ];
};
export default {
  name: "ExamSchool",
  data() {
    return {
      total: 0,
      column: column.call(this),
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      school_status: [
        { value: "A", label: "正常" },
        { value: "B", label: "暂停受理" },
        { value: "C", label: "取消资格" },
      ],
      school_level: [
        { value: "1", label: "一级" },
        { value: "2", label: "二级" },
        { value: "3", label: "三级" },
        { value: "0", label: "其他" },
      ],
      rules: {
        jxjb: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        reviewer: [
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
        jxzt: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        jxxh: [
          { pattern: /^\d{8}$/, message: "请输入8位数字", trigger: "change" },
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        jxdm: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        jxmc: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        jxjc: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        jxdz: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        lxr: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        lxdh: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        frdb: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        shr: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
        zjcx: [
          {
            required: true,
            message: "必填项",
            trigger: "change",
          },
        ],
      },
      form: {},
      visible: false,
      tableList: [],
      operating: 1, // 新增 1 修改 2 详情3
      title: "新增",
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
      examSchoolPageList(this.queryParams).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
      });
    },

    // 新增
    handleAddVisible() {
      this.operating = 1;
      this.form = { zjcx: [] };
      this.resetForm("form");
      this.title = "新增";
      this.visible = true;
    },

    // 修改
    handleUpdate(rows) {
      this.operating = 2;
      this.form = { ...rows };
      this.form.zjcx = this.form.zjcx.split(",");
      this.title = "修改";
      this.visible = true;
    },

    // 详情
    handleDetail(rows) {
      this.operating = 3;
      this.form = { ...rows };
      this.form.zjcx = this.form.zjcx.split(",");
      this.title = "详情";
      this.visible = true;
    },

    // 下载
    handleDownload() {
      const { glbm } = this.queryParams;
      if (!glbm) {
        return this.msgWarn("请先选择管理部门");
      }
      drvSchoolDownLoad({ glbm }).then((res) => {
        this.msgSuccess(res.msg);
      });
    },

    handleSure() {
      this.visible = true;
      if (this.operating !== 3) {
        // 新增，修改 逻辑
        this.$refs["form"].validate((valid) => {
          if (valid) {
            const params = { ...this.form };
            params.zjcx = params.zjcx.join();
            if (this.operating == 1) {
              examSchoolNewAdd(params).then(() => {
                this.getTableList();
                this.msgSuccess("新增成功");
                this.visible = false;
              });
            } else {
              params.cjsj = undefined;
              params.gxsj = undefined;
              params.fzjg = undefined;
              params.glbmMc = undefined;
              examSchoolUpdate(params).then(() => {
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
    },
  },
};
</script>

<style lang="scss" scoped>
.asd {
  /deep/ .el-input__inner {
    width: 100%;
  }
}

.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
