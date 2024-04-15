<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
    >
      <el-form-item>
          <jaya-select
            v-model="queryParams.deptId"
            type="UB"
            placeholder="管理部门"
            size="small"
          >
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
    </el-form>
    <jaya-table-group
      :total="total"
      :tableHeaderList="column"
      :tableList="tableData"
      @pagination="getTableList"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    ></jaya-table-group>
  </div>
</template>

<script>
import { userBlackList } from "@/api/exam/safety/blackList";
const column = function() {
  return  [
        {
          title: "序号",
          width: "60",
          slotFn: (item, index) => index + 1,
        },
        {
          title: "管理部门",
          prop: "deptName",
        },
        {
          title: "黑名单用户",
          prop: "lockUserName",
        },
        {
          title: "状态",
          prop: "status",
          width:"120",
          status:()=> {
            return this.statusList
          }
        },
        {
          title: "创建时间",
          prop: "createTime"
        },
        {
          title: "修改时间",
          prop: "updateTime"
        },
        // {
        //   title: "更新者",
        //   prop: "updateBy"
        // },
        {
          title: "说明",
          prop: "reason",
          width:'460'
        }
      ]
}
export default {
  name: "blackUser",
  data() {
    return {
      total: 0,
      queryParams: { 
        pageNum: 1, 
        pageSize: 20
      },
      statusList:[
        {
          label:"有效",
          value:0,
        },
        {
          label:"已解除",
          value:1,
        },
      ],
      column:column.call(this),
      tableData:[],
    };
  },
  methods: {
    getTableList(num) {
      if(num === 1) {
        this.queryParams.pageNum = num
      }
      userBlackList(this.queryParams).then(res=>{
        this.tableData = res.rows
        this.total = res.total
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
      width: 194px;
    }
    .el-textarea {
      width: 602px;
    }
    .gain {
      /deep/ .el-button--medium {
        padding: 10px;
      }
    }
  }
  .el-dialog__wrapper {
/deep/ .jaya-select .el-select {
    width: 194px;
  }
}
</style>
