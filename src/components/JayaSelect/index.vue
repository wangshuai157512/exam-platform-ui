<template>
  <div class="jaya-select">
    <el-select
      v-elTextLoading="loading"
      v-bind="$attrs"
      :style="sty || ''"
      v-model="val"
      clearable
      filterable
      @change="handleChange"
      :placeholder="placeholder || typeName[this.type] || '请选择'"
      size="small"
    >
      <el-option
        v-for="(option, index) in options"
        :key="index"
        :label="option.label"
        :value="lable ? option.label : option.value"
      />
    </el-select>
  </div>
</template>
<script>
const cacheTypeOptions = {};
import {
  getDrvSelect,
  getDeptSelect,
  getOtherSelect,
  getOrganSelect,
  getSchoolSelect,
  getExamCarSelect,
  getMonitorSelect,
  getExamRoomSelect,
  getExamToolSelect,
  getExamStaffSelect,
  getuserDeptSelect,
  getuserRoleSelect,
} from "@/api/param/select";
const fn = {
  X: getDrvSelect,
  O: getOtherSelect,
  B: getDeptSelect,
  F: getOrganSelect,
  C: getExamCarSelect,
  J: getMonitorSelect,
  L: getSchoolSelect,
  K: getExamRoomSelect,
  T: getExamToolSelect,
  S: getExamStaffSelect,
  UB: getuserDeptSelect,
  UR: getuserRoleSelect,
};

const typeName = {
  B: "部门管理",
  F: "发证机关",
  C: "考试车",
  J: "监控设备",
  K: "考场简称",
  S: "考试员",
  T: "考试设备",
  X: "考试项目",
  L: "驾校简称",
};

export default {
  name: "JayaSelect",
  props: {
    sty: String,
    lable: { type: Boolean, default: false },
    value: String | Array,
    type: String,
    placeholder: String,
    othername: { type: String, default: null },
    parameter: { type: String | Number, default: null },
    isCache: { type: Boolean, default: true },
  },
  data() {
    return {
      options: [],
      val: this.value,
      typeName,
      loading: false,
    };
  },
  mounted() {
    this.getOptions();
  },
  watch: {
    value(newVal) {
      this.val = newVal;
    },
    parameter() {
      this.getOptions();
    },
  },
  methods: {
    async getOptions() {
      // 缓存，避免相同类型组件重复请求
      if (this.othername) {
        if (true) {
          this.loading = true;
          const result = await fn["O"](this.othername);
          this.loading = false;
          cacheTypeOptions[this.othername] = result.data;
          this.options = result.data;
        } else {
          this.options = cacheTypeOptions[this.othername];
        }
      } else {
        if (true) {
          this.loading = true;
          const result = await fn[this.type](this.parameter);
          this.loading = false;
          cacheTypeOptions[this.type] = result.data;
          this.options = result.data;
          if (this.type == "X") {
            this.options = [...this.options, { label: "全景", value: "200001" }];
          }
        } else {
          this.options = cacheTypeOptions[this.type];
        }
      }
      this.$emit("getOptions", {
        data: this.options,
        type: this.othername || typeName[this.type],
      });
    },

    handleChange(val) {
      this.$emit("input", val);
    },
  },
};
</script>
<style scoped>
p {
  height: 32px;
}
</style>
