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
       <jaya-select 
            v-model="queryParams.kscxs" 
            placeholder="考试车型" 
            othername="exam_car_type"
            multiple
            sty="width:200px">
        </jaya-select>
      </el-form-item>
      <el-form-item>
          <el-select
            v-model="queryParams.status"
            placeholder="状态"
            size="small"
            clearable
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          v-hasPermi="['param:configuration:detectionConfig:add']"
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

     <!-- 添加编辑弹窗 -->
    <el-dialog :close-on-click-modal="false"
      :title="isEdit?'编辑':'添加'"
      :visible.sync="openAdd"
      width="680px"
      append-to-body
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
        <el-form-item label="考试简称" prop="kcxh">
          <jaya-select type="K" v-model="form.kcxh" :disabled="isEdit"></jaya-select>
        </el-form-item>
        <el-form-item label="考试车型" prop="kscx">
          <jaya-select 
              v-model="form.kscx" 
              placeholder="请选择" 
              othername="exam_car_type"
              :disabled="isEdit">
          </jaya-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择"
            size="small"
            :disabled="isEdit"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检测项目" prop="jcxm" v-if="jcxmList.length>0">
            <el-checkbox-group v-model="form.jcxm">
              <el-checkbox :label="item.checkCode" v-for="(item) in jcxmList" :key="item.checkCode">{{item.checkKey}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input type="textarea" rows="3" v-model="form.bz" :disabled="isEdit"></el-input>
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
import { detectionConfigList,detectionConfigAddItem,detectionConfigEditItem,detectionConfigAdd,detectionConfigEdit } from "@/api/param/configuration"
import { brandSelect } from '@/api/exam/examSubject' 
export default {
  name: "detectionConfig",
  data() {
    return {
      total: 0,
      queryParams: { 
        pageNum: 1, 
        pageSize: 20,
        kscxs:""
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
      statusList:[
         {
          label:"启用",
          value:"1",
        },
        {
          label:"停用",
          value:"0",
        },
      ],
      column:[
        {
          title: "考场简称",
          prop: "kcjc",
        },
        {
          title: "考试科目",
          prop: "kskm",
          status:()=>this.kskmList
        },
        {
          title: "考试车型",
          prop: "kscx",
          status:()=> {
            return 'exam_car_type'
          }
        },
        {
          title: "检测项目",
          prop: "jcxm",
          width:"700"
        },
        {
          title: "状态",
          prop: "status",
          status:()=>this.statusList
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
              auth:['param:configuration:detectionConfig:edit']
            },
          ],
        },
      ],
      tableData:[],
      form: {
        jcxm:[]
      },
      jcxmList:[],
      rules:{
        kskm: [
            { required: true, message: '必填项', trigger: 'change' }
        ],
        kcxh: [
            { required: true, message: '必填项', trigger: 'change' }
        ],
        kscx: [
            { required: true, message: '必填项', trigger: 'change' }
        ],
        status: [
            { required: true, message: '必填项', trigger: 'change' }
        ],
        jcxm: [
          { type: 'array', required: true, message: '请至少选择一个检查项', trigger: 'change' }
        ],
      },
      openAdd:false,
      isEdit:false,
    };
  },
  methods: {
     getTableList(num) {
      if(num === 1) {
        this.queryParams.pageNum = num
      }
      let queryDetections = this.queryParams.kscxs + ""
      detectionConfigList({...this.queryParams,kscxs:queryDetections}).then(res=>{
        this.tableData = res.rows
        this.total = res.total
      })
    },
    // 新增
    handleAdd() {
      this.isEdit = false
      this.form={
        jcxm:[]
      }
      this.jcxmList=[]
      this.resetForm("form");
      this.openAdd = true
    },
    // 编辑
    async edit(row) {
      this.isEdit = true
      this.form={
        jcxm:[]
      }
      this.jcxmList=[]
      await this.getEditItem(row.id) 
      let { id,kcxh,kscx,status,bz } = row
      this.form = {id,kcxh,kscx,status,bz,jcxm:this.form.jcxm}
      this.openAdd = true
    },
    // 获取添加检测项目
    getAddCheckItem() {
      if(!this.form.kcxh || this.isEdit) {
        return
      }
      detectionConfigAddItem({kcxh:this.form.kcxh}).then(res=> {
        this.jcxmList = res.data
      })
    },
    // 获取编辑检测项目
    async getEditItem(id) {
      let { data } = await detectionConfigEditItem({id})
      data.forEach(item=> {
        if(item.check) {
          this.form.jcxm.push(item.checkCode)
        }
      })
      this.jcxmList = data
    },
    
    // 提交
    handleUpload (formName) {
      this.$refs[formName].validate(async(valid) => {
        if(valid) {
          let queryChecked = this.form.jcxm + ''
          let { code } = this.isEdit?await detectionConfigEdit({...this.form,jcxm:queryChecked}):await detectionConfigAdd({...this.form,jcxm:queryChecked})
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
  },
  watch:{
    'form.kcxh':{
      handler:'getAddCheckItem'
    }
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
