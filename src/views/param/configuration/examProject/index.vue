<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
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
          sty="width:200px"
        >
        </jaya-select>
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
          v-hasPermi="['param:configuration:examProject:add']"
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
    <el-dialog
      :close-on-click-modal="false"
      :title="isEdit ? '编辑' : '添加'"
      :visible.sync="openAdd"
      width="1080px"
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
        <el-form-item label="考场简称" prop="kcxh">
          <jaya-select
            type="K"
            v-model="form.kcxh"
            :disabled="isEdit"
          ></jaya-select>
        </el-form-item>
        <el-form-item label="考试车型" prop="kscx">
          <el-select v-model="form.kscx" placeholder="请选择" size="small">
            <el-option
              v-for="item in kkcxList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <!-- <jaya-select
            v-model="form.kscx"
            placeholder="请选择"
            othername="exam_car_type"
            :disabled="isEdit"
          >
          </jaya-select> -->
        </el-form-item>
        <div class="pooject">
          <div :style="{ width: this.category === '1' ? '' : '100%' }">
            <div>白考考试项目<span style="color: red">*</span></div>
            <el-table
              ref="multipleTable"
              :data="bkksxmList"
              :empty-text="
                noNum ? '暂无数据' : '选择考场和车型后将点击搜索展示'
              "
              tooltip-effect="dark"
              style="width: 100%; margin-top: 10px"
              @selection-change="handleSelectionChange"
              :header-cell-class-name="listStatus === '1' ? cellClass : ''"
            >
              <el-table-column
                type="selection"
                width="55"
                :selectable="selected"
              >
              </el-table-column>
              <el-table-column prop="label" label="项目名称" align="center">
              </el-table-column>
              <el-table-column label="触发方式" width="240" align="center">
                <template slot-scope="scope">
                  <el-radio v-model="scope.row.bkksxmWay" label="0"
                    >系统触发</el-radio
                  >
                  <el-radio v-model="scope.row.bkksxmWay" label="1"
                    >人工触发</el-radio
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="category === '1'">
            <div>夜考考试项目</div>
            <el-table
              ref="multipleTableNight"
              :data="ykksxmList"
              empty-text="选择考场和车型后将点击搜索展示"
              tooltip-effect="dark"
              style="width: 100%; margin-top: 10px"
              @selection-change="handleSelectionChangeNight"
              :header-cell-class-name="listStatus === '1' ? cellClass : ''"
            >
              <el-table-column
                type="selection"
                width="55"
                :selectable="selected"
              >
              </el-table-column>
              <el-table-column prop="label" label="项目名称" align="center">
              </el-table-column>
              <el-table-column label="触发方式" width="240" align="center">
                <template slot-scope="scope">
                  <el-radio v-model="scope.row.ykksxmWay" label="0"
                    >系统触发</el-radio
                  >
                  <el-radio v-model="scope.row.ykksxmWay" label="1"
                    >人工触发</el-radio
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUpload('form')"
          >确 定</el-button
        >
        <el-button @click="openAdd = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  examProjectEdit,
  examProjectList,
  examProjectCode,
  examroomData,
} from "@/api/param/configuration";
export default {
  name: "examProject",
  data() {
    return {
      radio: "",
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        kscxs: "",
      },
      kskmList: [
        {
          label: "科目二",
          value: "2",
        },
        {
          label: "科目三",
          value: "3",
        },
      ],
      column: [
        {
          title: "考场简称",
          prop: "kcjc",
          width: "130",
        },
        {
          title: "考试车型",
          prop: "kscx",
          width: "80",
          status: () => {
            return "exam_car_type";
          },
        },
        {
          title: "白考考试项目",
          prop: "bkksxmmc",
          width: "360",
        },
        {
          title: "夜考考试项目",
          prop: "ykksxmmc",
          width: "360",
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
          title: "操作",
          width: "150",
          type: "buttons",
          fixed: "right",
          butList: [
            {
              title: "编辑",
              size: "mini",
              onClick: this.edit,
              auth: ["param:configuration:examProject:edit"],
            },
            // {
            //   title: "详情",
            //   size: "mini",
            //   onClick: this.info
            // },
          ],
        },
      ],
      tableData: [],
      form: {
        kcxh: "",
        kscx: "",
        xh: "",
      },
      bkksxmList: [],
      ykksxmList: [],
      rules: {
        // kskm: [
        //      { required: true, message: '必填项', trigger: 'change' }
        //  ],
        kcxh: [{ required: true, message: "必填项", trigger: "change" }],
        kscx: [{ required: true, message: "必填项", trigger: "change" }],
        bkksxm: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个考试项目",
            trigger: "change",
          },
        ],
      },
      multipleSelection: [],
      kkcxList: [],
      multipleSelectionNight: [],
      openAdd: false,
      isEdit: false,
      listStatus: "0", //'0'可配置，1固化
      category: "0", //'0'无夜考，1有夜考，
      noNum: false,
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      let queryVehicles = this.queryParams.kscxs + "";
      examProjectList({ ...this.queryParams, kscxs: queryVehicles }).then(
        (res) => {
          this.tableData = res.rows;
          this.total = res.total;
        }
      );
    },
    selected() {
      return this.listStatus === "1" ? false : true;
    },
    cellClass(row) {
      if (row.columnIndex === 0) {
        return "DisableSelection";
      }
    },
    // 新增
    async handleAdd() {
      this.isEdit = false;
      this.form = {
        kcxh: "",
        kscx: "",
        xh: "",
      };
      this.resetForm("form");
      this.bkksxmList = [];
      this.ykksxmList = [];
      // await this.getExamProjectCode();
      this.openAdd = true;
    },
    // 编辑
    async edit(row) {
      this.isEdit = true;
      this.openAdd = true;
      this.bkksxmList = [];
      this.ykksxmList = [];
      let { kcxh, kscx, xh, bkksxm, ykksxm, bkksxmWay, ykksxmWay } = row;
      const multipleSelection = {};
      const multipleSelectionNight = {};
      this.form = {
        kcxh,
        kscx,
        xh,
      };
      await this.getExamProjectCode();
      // 触发方式
      const bktriggerCheck = bkksxmWay?.split(",");
      this.bkksxmList.forEach((item) => {
        bktriggerCheck?.forEach((itemC) => {
          if (item.value === itemC.split("-")[0]) {
            item.bkksxmWay = itemC.split("-")[1];
          }
        });
      });
      const yktriggerCheck = ykksxmWay?.split(",");
      this.ykksxmList.forEach((item) => {
        yktriggerCheck?.forEach((itemC) => {
          if (item.value === itemC.split("-")[0]) {
            item.ykksxmWay = itemC.split("-")[1];
          }
        });
      });
      // 求交集
      const bkksxmCheck = bkksxm?.split(",");
      if (bkksxm) {
        bkksxmCheck.forEach((item) => {
          this.bkksxmList.forEach((jtem, index) => {
            if (jtem.value === item) {
              multipleSelection[index] = jtem;
            }
          });
        });
      }
      const ykksxmCheck = ykksxm?.split(",");
      if (ykksxm) {
        ykksxmCheck?.forEach((item) => {
          this.ykksxmList.forEach((jtem, index) => {
            if (jtem.value === item) {
              multipleSelectionNight[index] = jtem;
            }
          });
        });
      }
      this.$nextTick(() => {
        Object.keys(multipleSelection).map((key) => {
          this.$refs.multipleTable.toggleRowSelection(this.bkksxmList[key]);
        });
        if (this.category === "1") {
          Object.keys(multipleSelectionNight).map((key) => {
            this.$refs.multipleTableNight.toggleRowSelection(
              this.ykksxmList[key]
            );
          });
        }
      });
    },

    // 考试项目数据
    async getExamProjectCode() {
      return new Promise(async (resolve, reject) => {
        if (!this.form.kcxh) {
          // this.msgWarn("请选择考场");
          return;
        }
        if (!this.form.kscx) {
          // this.msgWarn("请选择车型");
          return;
        }
        let { data } = await examProjectCode({
          kcxh: this.form.kcxh,
          kscx: this.form.kscx,
        });
        this.listStatus = data.status;
        this.category = data.category;
        if (data.list.length < 1) {
          this.noNum = true;
        }
        this.bkksxmList = data.list.map((item) => ({
          ...item,
          bkksxmWay: "0",
        }));
        this.ykksxmList = data.list.map((item) => ({
          ...item,
          ykksxmWay: "0",
        }));
        if (!this.form.kcxh) {
          this.bkksxmList = [];
          this.ykksxmList = [];
        }
        resolve();
        if (this.listStatus === "1") {
          this.$refs.multipleTable.toggleAllSelection();
          this.multipleSelection = this.bkksxmList;
          if (this.category === "1") {
            this.$refs.multipleTableNight.toggleAllSelection();
            this.multipleSelectionNight = this.ykksxmList;
          }
          this.$nextTick(() => {
            let checkecNode = document.querySelectorAll(".el-checkbox__input");
            let checkecNodetop = document.querySelectorAll(
              ".DisableSelection .cell"
            );
            checkecNode.forEach((item) => {
              item.classList.add("is-checked");
            });
            checkecNodetop.forEach((item) => {
              item.classList.add("none");
            });
          });
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionChangeNight(val) {
      this.multipleSelectionNight = val;
    },
    // 提交
    handleUpload(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 固化提交全部，否则提交选中项
          let queryProject =
            this.listStatus === "1"
              ? this.bkksxmList
                  .map((item) => {
                    return item.value;
                  })
                  .join(",")
              : this.multipleSelection
                  .map((item) => {
                    return item.value;
                  })
                  .join(",");
          let queryTrigger =
            this.listStatus === "1"
              ? this.bkksxmList
                  .map((item) => {
                    return item.value + "-" + item.bkksxmWay;
                  })
                  .join(",")
              : this.multipleSelection
                  .map((item) => {
                    return item.value + "-" + item.bkksxmWay;
                  })
                  .join(",");
          let queryProjectNight =
            this.listStatus === "1"
              ? this.ykksxmList
                  .map((item) => {
                    return item.value;
                  })
                  .join(",")
              : this.multipleSelectionNight
                  .map((item) => {
                    return item.value;
                  })
                  .join(",");
          let queryTriggerNight =
            this.listStatus === "1"
              ? this.ykksxmList
                  .map((item) => {
                    return item.value + "-" + item.ykksxmWay;
                  })
                  .join(",")
              : this.multipleSelectionNight
                  .map((item) => {
                    return item.value + "-" + item.ykksxmWay;
                  })
                  .join(",");
          if (!queryProject) {
            this.msgWarn("请选择白考考试项目在进行提交");
            return;
          }
          let { code } = await examProjectEdit({
            ...this.form,
            bkksxm: queryProject,
            ykksxm: this.category === "1" ? queryProjectNight : "",
            bkksxmWay: queryTrigger,
            ykksxmWay: this.category === "1" ? queryTriggerNight : "",
          });
          if (code === 200) {
            this.$message({
              message: this.isEdit ? "编辑成功" : "添加成功",
              type: "success",
            });
            this.getTableList();
            this.openAdd = false;
          }
        }
      });
    },
  },
  mounted() {
    this.getTableList();
  },
  watch: {
    "form.kcxh": {
      handler(v) {
        if (!this.isEdit) {
          this.getExamProjectCode();
        }
        examroomData({ id: v }).then((res) => {
          if (res.data) {
            this.kkcxList = res.data.kkcx.split(",");
          }
        });
      },
    },
    "form.kscx": {
      handler() {
        if (!this.isEdit) {
          this.getExamProjectCode();
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-input,
  .el-select {
    width: 194px;
  }
  .pooject {
    width: 100%;
    display: flex;
    justify-content: space-between;
    & div {
      width: 49%;
    }
  }
}
.el-dialog__wrapper {
  /deep/ .jaya-select .el-select {
    width: 194px;
  }
  /deep/ .el-table .DisableSelection > .cell {
    display: none !important;
  }
}
</style>
