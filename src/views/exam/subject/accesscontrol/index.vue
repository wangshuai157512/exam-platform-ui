<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="xm">
        <el-input
          size="small"
          v-model="queryParams.xm"
          placeholder="姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="sfzmhm">
        <el-input
          clearable
          style="width: 180px"
          size="small"
          v-model="queryParams.sfzmhm"
          placeholder="身份证号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="kcxh">
        <jaya-select v-model="queryParams.kcxh" type="K" />
      </el-form-item>
      <el-form-item label="" prop="kskm">
        <el-select
          clearable
          placeholder="考试科目"
          v-model="queryParams.kskm"
          size="small"
        >
          <el-option
            v-for="(option, index) in suject"
            :key="index"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="ksrq">
        <el-date-picker
          clearable
          v-model="queryParams.ksrq"
          size="small"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="考试日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="bdhj">
        <el-select
          clearable
          placeholder="比对环节"
          v-model="queryParams.bdhj"
          size="small"
        >
          <el-option
            v-for="(option, index) in comparison"
            :key="index"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="zjrk">
        <el-select
          clearable
          placeholder="闸机入口"
          v-model="queryParams.zjrk"
          size="small"
        >
          <el-option
            v-for="(option, index) in entrance"
            :key="index"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="">
        <el-button
          @click="getTableList(1)"
          icon="el-icon-search"
          size="small"
          type="primary"
          >搜索</el-button
        >
        <el-button
          @click="handlefull"
          icon="el-icon-search"
          size="small"
          type="primary"
          >表格全屏</el-button
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
      title="详情"
      :visible.sync="visible"
      width="670px"
      append-to-body
    >
      <el-form
        :model="detailForm"
        ref="examForm"
        :inline="true"
        :disabled="true"
        class="dialogForm"
      >
        <el-form-item label="姓名">
          <el-input v-model="detailForm.xm" placeholder="姓名" size="small" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input
            v-model="detailForm.sfzmhm"
            placeholder="身份证号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考场简称">
          <el-input
            v-model="detailForm.kcjc"
            placeholder="考场简称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考试科目">
          <el-select
            placeholder="考试科目"
            v-model="detailForm.kskm"
            size="small"
          >
            <el-option
              v-for="(option, index) in suject"
              :key="index"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="考试日期">
          <el-input
            v-model="detailForm.ksrq"
            placeholder="考试日期"
            size="small"
          />
        </el-form-item>
        <el-form-item label="考试地点">
          <el-input
            v-model="detailForm.ksdd"
            placeholder="考试地点"
            size="small"
          />
        </el-form-item>
        <el-form-item label="比对环节">
          <el-input
            v-model="detailForm.bdhj"
            placeholder="比对环节"
            size="small"
          />
        </el-form-item>
        <el-form-item label="闸机入口">
          <el-input
            v-model="detailForm.zjrk"
            placeholder="闸机入口"
            size="small"
          />
        </el-form-item>
        <el-form-item label="进入时间">
          <el-input
            v-model="detailForm.jrsj"
            placeholder="进入时间"
            size="small"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            cols="76"
            rows="3"
            v-model="detailForm.bz"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAccessPageList, getAccessInfo } from "@/api/exam/access";
const column = function () {
  return [
    {
      title: "序号",
      slotFn: (item, index) => index + 1,
      width: "80"
    },
    {
      title: "考场简称",
      prop: "kcjc"
    },
    {
      title: "姓名",
      prop: "xm"
    },
    {
      title: "身份证",
      prop: "sfzmhm"
    },
    {
      title: "考试科目",
      prop: "kskm",
      status: () => {
        return this.suject;
      }
    },
    {
      title: "考试日期",
      prop: "ksrq",
      slotFn: (item) => item.ksrq?.split(" ")[0]
    },
    {
      title: "进入时间",
      prop: "jrsj"
    },
    {
      title: "比对环节",
      prop: "bdhj",
      status: () => {
        return this.comparison;
      }
    },
    {
      title: "闸机入口",
      prop: "zjrk",
      status: () => {
        return this.entrance;
      }
    },
    {
      title: "备注",
      prop: "bz"
    },
    {
      title: "操作",
      width: "150",
      type: "buttons",
      fixed: "right",
      butList: [
        {
          auth: ["exam:accesscontrol:detail"],
          title: "详情",
          size: "mini",
          onClick: this.handleDetail
        }
      ]
    }
  ];
};
export default {
  name: "AccessControl",
  data() {
    return {
      total: 0,
      tableList: [],
      visible: false,
      detailForm: {},
      column: column.call(this),
      queryParams: { pageNum: 1, pageSize: 20 },
      comparison: [
        { label: "候考室闸机", value: 1 },
        { label: "待考室闸机", value: 2 }
      ], // 比对环节
      entrance: [
        { label: "入口", value: 1 },
        { label: "出口", value: 2 }
      ], //闸机入口
      suject: [
        { value: "2", label: "科目二" },
        { value: "3", label: "科目三" }
      ]
    };
  },
  methods: {
    getTableList() {
      getAccessPageList(this.queryParams).then((res) => {
        this.tableList = res.rows;
        this.total = res.total;
      });
    },
    handleDetail(row) {
      const { id } = row;

      getAccessInfo({ id }).then((res) => {
        const { zjrk, bdhj } = res.data;

        this.detailForm = {
          ...res.data,
          zjrk: this.entrance.find((item) => item.value == zjrk)?.label,
          bdhj: this.comparison.find((item) => item.value == bdhj)?.label
        };
        this.visible = true;
      });
    },
    handlefull() {
      localStorage.setItem('tableQuery',JSON.stringify(this.queryParams))
     const { href } = this.$router.resolve({
      name:'fullscreen'
     });
      window.open(`${href}`,'fullscreen=yes')
      // this.$router.push({
      //   name:'fullscreen',
      //   params:this.queryParams
      // })
    }
  },
  mounted() {
    this.getTableList();
  }
};
</script>

<style lang="scss" scoped></style>
