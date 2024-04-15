<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
    >
      <el-form-item>
          <el-select
            v-model="queryParams.computerType"
            placeholder="计算机类型"
            size="small"
            clearable
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          <el-date-picker
            v-model="queryParams.lockDate"
            type="date"
            placeholder="锁定日期"
            value-format="yyyy-MM-DD"
            size="small">
          </el-date-picker>
      </el-form-item>
      <el-form-item>
          <el-date-picker
            v-model="queryParams.unlockDate"
            type="date"
            placeholder="解锁日期"
            value-format="yyyy-MM-DD"
            size="small">
          </el-date-picker>
      </el-form-item>
      <el-form-item>
          <el-input v-model="queryParams.keyword" placeholder="触发锁定用户、解锁人、计算机IP" style="width:260px" size="small"></el-input>
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
import { computerBlackList } from "@/api/exam/safety/blackList";
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
          title: "锁定时间",
          prop: "createTime"
        },
        {
          title: "解锁时间",
          prop: "updateTime"
        },
        {
          title: "解锁人",
          prop: "createUserName"
        },
        {
          title: "计算机类型",
          prop: "computerType",
          status:()=> {
            return this.typeList
          }
        },
        {
          title: "计算机IP",
          prop: "ip"
        },
        {
          title: "计算机MAC",
          prop: "mac"
        },
        {
          title: "状态",
          prop: "status",
          status:()=> {
            return this.statusList
          }
        },
        {
          title: "说明",
          prop: "reason"
        }
      ]
}
export default {
  name: "blackComputer",
  data() {
    return {
      total: 0,
      queryParams: { 
        pageNum: 1, 
        pageSize: 20
      },
      typeList:[
        {
          label:'考试辅助管理机',
          value:0
        },
        {
          label:'参数设置管理机',
          value:1
        },
        {
          label:'自助签到机',
          value:2
        },
        {
          label:'自助报到机',
          value:3
        },
        {
          label:'排考叫号机',
          value:4
        },
        {
          label:'自助查询机',
          value:5
        },
        {
          label:'入候考室闸机',
          value:6
        },
        {
          label:'入考场闸机',
          value:7
        },
        {
          label:'自助签名机',
          value:8
        },
        {
          label:'信息采集机',
          value:9
        }
      ],
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
      computerBlackList(this.queryParams).then(res=>{
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
</style>
