<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
    >
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
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          v-hasPermi="['param:configuration:interface:add']"
          >添加</el-button
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

     <!-- 添加文件窗 -->
    <el-dialog :close-on-click-modal="false"
      :title="title"
      :visible.sync="openAdd"
      width="680px"
      append-to-body
    >
      <el-form
       :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
        :disabled="operation==='3'"
        class="dialogForm"
      >
        <!-- <el-form-item label="考试科目" prop="kskm">
          <el-select
            v-model="form.kskm"
            placeholder="请选择"
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
        <el-form-item label="考场简称" prop="kcxh">
          <jaya-select type="K" v-model="form.kcxh"></jaya-select>
        </el-form-item>
        <el-form-item label="类型" prop="lx">
          <el-select
            v-model="form.lx"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in lxList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="系统名称" prop="xtmc">
          <el-input
            v-model="form.xtmc"
            placeholder="请输入"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="厂商" prop="cs">
          <el-input
            v-model="form.cs"
            placeholder="请输入"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="zt">
          <el-select
            v-model="form.zt"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in ztList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="代理接口" prop="agent">
          <el-select
            v-model="form.agent"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in agentList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="监管系统地址" prop="jgxtdz" class="supervise-number">
          <el-input
            v-model="form.jgxtdz"
            placeholder="请输入"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="监管序列号" prop="jgxtxlh" class="supervise-number">
          <el-input
            v-model="form.jgxtxlh"
            placeholder="请输入"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="备案系统序号" prop="baxh">
          <el-input
            v-model="form.baxh"
            placeholder="请输入"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="照片类型" prop="zplx">
          <jaya-select v-model="form.zplx" othername="photo_type"></jaya-select>
        </el-form-item>
        <el-form-item label="监管接口" prop="jgjk">
          <jaya-select v-model="form.jgjk" othername="monitor_api"></jaya-select>
        </el-form-item>
        <el-form-item label="系统序列号" v-if="operation==='3'">
          <el-input type="textarea" rows="3" v-model="form.xtxlh"></el-input>
        </el-form-item>
      </el-form>  
      <div slot="footer" class="dialog-footer" v-if="operation!=='3'">
        <el-button type="primary" @click="handleUpload('form')">确 定</el-button>
        <el-button @click="openAdd=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { interfaceEdit,interfaceList,interfaceDownLoad } from "@/api/param/configuration";
export default {
  name: "interface",
  data() {
    return {
      total: 0,
      queryParams: { 
        pageNum: 1, 
        pageSize: 20,
      },
      kskmList:[
        {
          label:"科目二",
          value:"2",
        },
        {
          label:"科目三",
          value:"3",
        },
      ],
      column:[
        {
          title: "考场简称",
          prop: "kcjc",
          width:"130",
        },
        {
          title: "类型",
          prop: "lx",
          width:"80",
          status:()=> this.lxList
        },
        {
          title: "系统名称",
          prop: "xtmc",
        },
        {
          title: "厂商",
          prop: "cs",
        },
        {
          title: "状态",
          width:"80",
          prop: "zt",
          status:()=> this.ztList
        },
        {
          title: "代理接口",
          prop: "agent",
          width:"80",
          status:()=> this.agentList
        },
        // {
        //   title: "系统序列号",
        //   prop: "xtxlh",
        //   width:"200"
        // },
        {
          title: "监管序列号",
          prop: "jgxtxlh"
        },
        {
          title: "监管系统地址",
          prop: "jgxtdz"
        },
        {
          title: "备案系统序号",
          prop: "baxh"
        },
        {
          title: "照片类型",
          prop: "zplx",
          status:()=> { return "photo_type" }
        },
        {
          title: "监管接口",
          prop: "jgjk",
          status:()=> { return "monitor_api" }
        },
        {
          title: "操作",
          width: "150",
          type: "buttons",
          fixed:"right",
          butList: [
            {
              title: "编辑",
              size: "mini",
              onClick:this.edit,
              auth:['param:configuration:interface:edit']
            },
            {
              title: "详情",
              size: "mini",
              onClick:this.detail,
              auth:['param:configuration:interface:detail']
            },
            {
              title: "下载",
              size: "mini",
              onClick:this.downLoad,
              auth:['param:configuration:interface:downLoad']
            },
          ],
        },
      ],
      tableData:[],
      form: {},
      title:"",
      operation:"", //1新增2编辑3详情
      lxList:[
        {
          label:"考试系统",
          value:"E",
        },
        {
          label:"其它",
          value:"O",
        },
      ],
      ztList:[
        {
          label:"停用",
          value:"0",
        },
        {
          label:"启用",
          value:"1",
        },
      ],
      agentList:[
        {
          label:"否",
          value:"0",
        },
        {
          label:"是",
          value:"1",
        },
      ],
      rules:{
        // kskm: [
        //      { required: true, message: '必填项', trigger: 'change' }
        //  ],
        kcxh: [
            { required: true, message: '必填项', trigger: 'change' }
        ],
        xtmc: [
            { required: true, message: '必填项', trigger: 'blur' }
        ],
        baxh: [
            { required: true, message: '必填项', trigger: 'blur' }
        ],
        lx: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        zt: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        agent: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        jgxtdz: [
            { required: true, message: '必填项', trigger: 'blur' }
        ],
        jgxtxlh: [
            { required: true, message: '必填项', trigger: 'blur' }
        ],
        zplx: [
            { required: true, message: '必填项', trigger: 'change' }
        ],
        jgjk: [
            { required: true, message: '必填项', trigger: 'change' }
        ],
      },
      openAdd:false,
    };
  },
  methods: {
     getTableList(num) {
      if(num === 1) {
        this.queryParams.pageNum = num
      }
      interfaceList(this.queryParams).then(res=>{
        this.tableData = res.rows
        this.total = res.total
      })
    },
    // 新增
    handleAdd() {
      this.title = "新增"
      this.operation = "1"
      this.openAdd = true
      this.form={
        xtxh:''
      }
      this.resetForm("form");
    },
    // 编辑
    edit(row) {
      this.title = "编辑"
      this.operation = "2"
      this.openAdd = true
      let { agent,baxh,cs,jgjk,jgxtdz,jgxtxlh,kcxh,lx,xtmc,zplx,zt,xtxh } = row
      let queryForm = { agent,baxh,cs,jgjk,jgxtdz,jgxtxlh,kcxh,lx,xtmc,zplx,zt,xtxh }
      this.form = queryForm
    },
    // 详情
    detail(row) {
      this.title = "详情"
      this.operation = "3"
      this.openAdd = true
      this.form = row
    },
    // 提交
    handleUpload (formName) {
      this.$refs[formName].validate(async(valid) => {
        if(valid) {
          let { code } = await interfaceEdit(this.form)
          if(code === 200) {
            this.$message({
              message:this.operation === '2'?'编辑成功':"添加成功",
              type:'success'
            });
            this.getTableList()
            this.openAdd = false
          }
        }
      })
    },

    // 下载
    downLoad(row) {
      interfaceDownLoad(`"${row.xtxh}"`).then(res=> {
          if('msSaveOrOpenBlob' in navigator){
            //ie使用的下载方式
            window.navigator.msSaveOrOpenBlob(res, 'systemconfig.xml');
          } else {
              let link = document.createElement("a");
              link.href = window.URL.createObjectURL(res);
              //文件名和格式
              link.download = "systemconfig.xml";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          } 
      })
    }
  },
  mounted() {
    this.getTableList()
  }
};
</script>

<style lang="scss" scoped>
  .el-dialog {
    .el-input,.el-select {
      width: 100%;
    }
    .el-textarea {
      width: 602px;
    }
  }
  .supervise-number {
    /deep/.el-form-item__content {
      width: 605px!important;
      /deep/ .el-input {
      width: 100%!important;
    }
    .el-input__inner {
        width: 605px!important;
      }
    }
    
  }
  .el-dialog__wrapper {
/deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
