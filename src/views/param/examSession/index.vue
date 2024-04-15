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
          v-hasPermi="['param:configuration:examSession:add']"
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
      :title="isEdit?'编辑':'添加'"
      :visible.sync="openAdd"
      width="680px"
      append-to-body
      v-if="openAdd"
    >
      <el-form
       :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
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
        <el-form-item label="所属考场" prop="kcxh">
          <jaya-select type="K" v-model="form.kcxh"></jaya-select>
        </el-form-item>
        <el-form-item label="考试场次" prop="kscc">
          <el-input v-model="form.kscc" size="small" placeholder="请输入"></el-input>
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
         <el-form-item label="限制开始时间" prop="xzkssj">
          <el-time-picker v-model="form.xzkssj" value-format="HH:mm:ss">
          </el-time-picker>
        </el-form-item>
         <el-form-item label="限制结束时间" prop="xzjssj">
          <el-time-picker v-model="form.xzjssj" value-format="HH:mm:ss">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" rows="3" v-model="form.sm"></el-input>
        </el-form-item>
      </el-form>  
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUpload('form')">确 定</el-button>
        <el-button @click="openAdd=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { examSessionEdit,examSessionList } from "@/api/param/configuration";
export default {
  name: "examSession",
  data() {
    return {
      total: 0,
      queryParams: { 
        pageNum: 1, 
        pageSize: 20,
        kskm:"",
        kcxh:""
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
        },
        {
          title: "考试场次",
          prop: "kscc",
        },
        {
          title: "考试科目",
          prop: "kskm",
          status:()=>this.kskmList
        },
        {
          title: "限制开始时间",
          prop: "xzkssj",
        },
        {
          title: "限制结束时间",
          prop: "xzjssj",
        },
        {
          title: "更新时间",
          prop: "gxsj",
        },
        {
          title: "创建时间",
          prop: "cjsj",
        },
        {
          title: "说明",
          prop: "sm",
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
              auth:['param:configuration:examSession:edit']
            },
          ],
        },
      ],
      tableData:[],
      form: {
        // kskm:"",
        kcxh:"",
        zt:"",
        kscc:"",
        xh:"",
        xzkssj:"",
        xzjssj:"",
        sm:""
      },
      ztList:[
        {
          label:"停用",
          value:"0",
        },
        {
          label:"正常",
          value:"1",
        }
      ],
      ksccList:[],
      rules:{
        // kskm: [
        //     { required: true, message: '必填项', trigger: 'change' }
        // ],
        kcxh: [
            { required: true, message: '必填项', trigger: 'change' }
        ],
        zt: [
            { required: true, message: '必填项', trigger: 'change' }
        ],
        kscc: [
            { required: true, message: '必填项', trigger: 'change' }
        ]

      },
      openAdd:false,
      isEdit:false
    };
  },
  methods: {
     getTableList(num) {
      if(num === 1) {
        this.queryParams.pageNum = num
      }
      examSessionList(this.queryParams).then(res=>{
        this.tableData = res.rows
        this.total = res.total
      })
    },
    // 新增
    handleAdd() {
      this.isEdit = false
      this.openAdd = true
      this.form={ 
        // kskm:"",
        kcxh:"",
        zt:"1",
        kscc:"",
        xh:"",
        xzkssj:"",
        xzjssj:"",
        sm:""
      }
      this.resetForm("form");
    },
    // 编辑
    edit(row) {
      this.isEdit = true
      this.openAdd = true
      let { kcxh,zt,kscc,xh,xzkssj,xzjssj,sm } = row
      let queryForm = { kcxh,zt,kscc,xh,xzkssj,xzjssj,sm }
      Object.assign(this.form,queryForm)
    },
    // 提交
    handleUpload (formName) {
      this.$refs[formName].validate(async(valid) => {
        if(valid) {
          console.log(this.form,1111)
          let { code } = await examSessionEdit(this.form)
          if(code === 200) {
            this.$message({
              message:this.isEdit?'编辑成功':"添加成功",
              type:'success'
            });
            this.getTableList()
            this.openAdd = false
          }
        }
      })
      

    },
  },
  mounted() {
    this.getTableList()
  }
};
</script>

<style lang="scss" scoped>
  .el-dialog {
    .el-input,.el-select {
      width: 194px;
    }
    .el-textarea {
      width: 602px;
    }
  }
  .el-dialog__wrapper {
/deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
