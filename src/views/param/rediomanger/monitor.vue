<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="kcxh">
        <jaya-select
          v-model="queryParams.kcxh"
          type="K"
          placeholder="考场简称"
        />
      </el-form-item>
      <el-form-item prop="sblx">
        <jaya-select
          size="small"
          v-model="queryParams.sblx"
          placeholder="设备类型"
          @getOptions="getOptions"
          othername="videquipment_type"
        />
        <!-- <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          /> -->
      </el-form-item>
      <el-form-item prop="sbmc">
        <el-input
          v-model="queryParams.sbmc"
          placeholder="设备名称"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item prop="wldz">
        <el-input
          v-model="queryParams.wldz"
          placeholder="IP地址"
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
          v-hasPermi="['rediomanger:monitor:add']"
          icon="el-icon-plus"
          size="small"
          type="primary"
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
      :visible.sync="openAdd"
      width="680px"
      append-to-body
      :destroy-on-close="true"
      v-if="openAdd"
    >
      <el-form
        class="dialogForm"
        :disabled="operating == 3"
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
      >
        <el-form-item label="考场名称" prop="kcxh">
          <jaya-select v-model="form.kcxh" type="K" />
        </el-form-item>
        <el-form-item label="设备名称" prop="sbmc">
          <el-input
            style="width: 194px"
            v-model="form.sbmc"
            placeholder="请输入设备名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="型号" prop="xh">
          <el-input v-model="form.xh" placeholder="请输入型号" size="small" />
        </el-form-item>
        <el-form-item label="设备类型" prop="sblx">
          <jaya-select
            v-model="form.sblx"
            placeholder="请选择设备类型"
            size="small"
            @getOptions="getOptions"
            othername="videquipment_type"
          />
          <!-- <el-option
              v-for="status in statusOption"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            /> -->
        </el-form-item>
        <el-form-item label="网络地址" prop="wldz">
          <el-input
            v-model="form.wldz"
            placeholder="请输入网络地址"
            size="small"
          />
        </el-form-item>
        <el-form-item label="端口" prop="dk">
          <el-input v-model="form.dk" placeholder="请输入端口" size="small" />
        </el-form-item>
        <el-form-item label="用户名" prop="yhm">
          <el-input
            style="width: 207px"
            v-model="form.yhm"
            placeholder="请输入用户名"
            size="small"
          />
        </el-form-item>
        <el-form-item label="密码" prop="mm">
          <el-input v-model="form.mm" placeholder="请输入密码" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSure('form')">确 定</el-button>
        <el-button @click="openAdd = false">取 消</el-button>
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
        <el-form-item label="设备序号" prop="sbxh">
          <el-input
            style="width: 194px"
            v-model="forms.sbxh"
            size="small"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="考场名称" prop="kcxh">
          <jaya-select v-model="forms.kcxh" type="K" />
        </el-form-item>
        <el-form-item label="设备名称" prop="sbmc">
          <el-input
            style="width: 194px"
            v-model="forms.sbmc"
            placeholder="请输入设备名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="型号" prop="xh">
          <el-input v-model="forms.xh" placeholder="请输入型号" size="small" />
        </el-form-item>
        <el-form-item label="设备类型" prop="sblx">
          <jaya-select
            v-model="forms.sblx"
            placeholder="请选择设备类型"
            size="small"
            @getOptions="getOptions"
            othername="videquipment_type"
          />
          <!-- <el-option
              v-for="status in statusOption"
              :key="status.value"
              :label="status.label"
              :value="status.value"
              style="width: 194px"
            /> -->
        </el-form-item>
        <el-form-item label="网络地址" prop="wldz">
          <el-input
            v-model="forms.wldz"
            placeholder="请输入网络地址"
            size="small"
            style="width: 194px"
          />
        </el-form-item>
        <el-form-item label="端口" prop="dk">
          <el-input
            v-model="forms.dk"
            placeholder="请输入端口"
            size="small"
            style="width: 194px"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="yhm">
          <el-input
            style="width: 194px"
            v-model="forms.yhm"
            placeholder="请输入用户名"
            size="small"
          />
        </el-form-item>
        <el-form-item label="密码" prop="mm">
          <el-input
            v-model="forms.mm"
            placeholder="请输入密码"
            size="small"
            style="width: 194px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bianjihand('forms')">确 定</el-button>
        <el-button @click="bianjivisible = false">取 消</el-button>
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

<script>
import {
  monitorAdd,
  monitormation,
  monitorlist,
  monitordel,
  monitorupdate
} from "@/api/param/rediomanger";
const column = function () {
  return [
    {
      title: "考场简称",
      prop: "kcjc"
    },
    {
      title: "设备名称",
      width: "150",
      prop: "sbmc"
    },
    {
      title: "型号",
      width: "150",
      prop: "xh"
    },
    {
      title: "设备类型",
      width: "150",
      prop: "sblx",
      status: () => this.statusOption
    },
    {
      title: "网络地址",
      width: "150",
      prop: "wldz"
    },
    {
      title: "端口",
      width: "150",
      prop: "dk"
    },
    {
      title: "用户名",
      width: "150",
      prop: "yhm"
    },
    {
      title: "密码",
      prop: "mm"
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
          onClick: this.xiangqinghandle,
          auth: ["rediomanger:monitor:details"]
        },
        {
          title: "编辑",
          size: "mini",
          disabled: false,
          onClick: this.handleDetail,
          auth: ["rediomanger:monitor:edit"]
        }

        /*{
          title: "删除",
          size: "mini",
          disabled: false,
          onClick: this.dealDetail,
        },*/
      ]
    }
  ];
};
let beforeUpdate = {};
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
        sblx: "",
        sbmc: ""
      },
      statusOption: [],
      // kcList: [],
      rules: {
        kcxh: [
          { pattern: /^\d{8}$/, message: "请输入8位数字" },
          { required: true, trigger: "blur", message: "必填项" }
        ],
        sbmc: [{ required: true, trigger: "blur", message: "必填项" }],
        xh: [{ required: true, trigger: "blur", message: "必填项" }],
        sblx: [{ required: true, trigger: "blur", message: "必填项" }],
        wldz: [
          {
            pattern:
              /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            message: "请填写正确的IP地址"
          },
          { required: true, trigger: "blur", message: "必填项" }
        ],
        dk: [
          {
            pattern:
              /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/,
            message: "端口号不能超过65535"
          },
          { required: true, trigger: "blur", message: "必填项" }
        ],
        yhm: [{ required: true, trigger: "blur", message: "必填项" }],
        mm: [{ required: true, trigger: "blur", message: "必填项" }]
      },
      tableList: [],
      form: {},
      forms: {},
      visible: false,
      openAdd: false,
      scvisible: false,
      bjvisible: false,
      bianjivisible: false,
      operating: 1, //添加1 编辑2 详情3
      title: "添加设备监控"
    };
  },

  mounted() {
    this.getTableList();
  },

  methods: {
    getOptions({ data, type }) {
      if (type == "videquipment_type") {
        this.statusOption = data;
      }
    },
    //搜索列表
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      monitorlist(this.queryParams).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
      });
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    //详情
    xiangqinghandle(row) {
      const rows = { ...row };
      this.operating = 3;
      this.title = "详情";
      this.form = rows;
      this.openAdd = true;
    },
    // 添加信息
    handleAddVisible() {
      this.form = {};
      this.operating = 1;
      this.title = "添加设备监控";
      this.openAdd = true;
    },

    // 编辑
    handleDetail(row) {
      const rows = { ...row };
      this.operating = 2;
      this.title = "编辑设备监控";
      this.bianjivisible = true;
      this.forms = rows;
      beforeUpdate = Object.assign({}, rows);
    },
    //删除
    /*dealDetail(row) {
      this.title = "提示";
      this.scvisible = true;
       const rows = { ...row };
       this.form = rows;
    },*/

    //编辑确定按钮
    bianjihand(formNames) {
      this.bianjivisible = true;
      this.forms.kcjc = undefined;
      this.$refs[formNames].validate((valid) => {
        if (valid) {
          if (this.operating == 2) {
            monitorupdate({
              ...this.forms
            }).then(() => {
              this.getTableList();
              this.msgSuccess("修改成功");
            });
            
            this.bianjivisible = false;
          }
        }
      });
    },

    //添加功能确定按钮
    handleSure(formName) {
      if (this.operating !== 3) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.operating == 1) {
              monitorAdd({
                ...this.form
              }).then(() => {
                this.getTableList();
                this.msgSuccess("添加成功");
              });
            }
            this.openAdd = false;
          }
        });
      } else {
        this.openAdd = false;
      }
    }
    //删除功能按钮
    /*dealDetail(){
       this.scvisible = true;
       if (this.operating == 1) {
        monitordel({
          ...this.form,
        }).then(() => {
          this.getTableList();
          this.msgSuccess("删除成功");
        });
        this.scvisible=false;
      }
    }*/
  }
};
</script>
<style lang="scss" scoped>
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
