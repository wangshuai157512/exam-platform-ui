import { getExaminerList } from "@/api/exam/examiner";
import { getDicts } from "@/api/system/dict/data";
import { getSimple } from "@/api/system/school";
export const asyncComponent = {
  install: function(Vue) {
    // 考试车型下拉框
    Vue.component("exam-car-select", function(resolve) {
      getDicts("car_type").then(res => {
        resolve({
          props: {
            value: String,
            disabled: false
          },
          data() {
            return { carOptions: res.data || [], val: this.value };
          },
          template: `<el-select :disabled="disabled"
                style="width:140px"
                placeholder="考试车型"
               @change="handleChange"
               clearable v-model="val">
                  <el-option
                    v-for="car in carOptions"
                    :key="car.dictValue"
                    :value="car.dictValue"
                    :label="car.dictLabel"
                  >
                  </el-option>
                </el-select>`,
          methods: {
            handleChange(val) {
              this.$emit("input", val);
            }
          }
        });
      });
    });
    // 考试员下拉框
    Vue.component("exam-staff-select", function(resolve) {
      getExaminerList({ pageNum: 1, pageSize: 200, userType: 1 }).then(res => {
        resolve({
          props: {
            value: String,
            disabled: false
          },
          data() {
            return { staffOptions: res.rows || [], val: this.value };
          },
          template: `<el-select :disabled="disabled"
                      filterable
                    style="width:140px"  
                    placeholder="考试员"
                   @change="handleChange"
                   clearable v-model="val">
                      <el-option
                        v-for="staff in staffOptions"
                        :key="staff.sfzmhm"
                        :value="staff.sfzmhm"
                        :label="staff.nickName"
                      >
                      </el-option>
                    </el-select>`,
          methods: {
            handleChange(val) {
              this.$emit("input", val);
            }
          }
        });
      });
    });
    // 驾校简称下拉框
    Vue.component("school-select", function(resolve) {
      getSimple().then(res => {
        resolve({
          props: {
            value: String,
            disabled: false
          },
          data() {
            return { schoolOptions: res.rows || [], val: this.value };
          },
          template: `<el-select :disabled="disabled"
                          filterable
                        style="width:140px"  
                        placeholder="驾校简称"
                       @change="handleChange"
                       clearable v-model="val">
                          <el-option
                            v-for="school in schoolOptions"
                            :key="school.jxdm"
                            :value="school.jxdm"
                            :label="school.jxjc"
                          >
                          </el-option>
                        </el-select>`,
          methods: {
            handleChange(val) {
              this.$emit("input", val);
            }
          }
        });
      });
    });
  }
};
