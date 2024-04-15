<template>
  <div v-if="selectList.length">
    <div class="select-con">
      <el-form :inline="true" ref="form" class="refer-from">
        <div v-for="item in selectList" :key="item.title" style="display:inline-block">
          <el-form-item :label="item.title + '：'" v-if="item.type === 'select'" :key="item.title" class="change-label-calss">
            <el-select
                v-model="requestForm[item.requestKey]"
                label="item.lable"
                placeholder="请选择"
                :filterable="item.isSearch"
                @change="item.change && item.change($event)"
            >
              <el-option
                  v-for="itemChild in item.data"
                  :key="itemChild[item.value]"
                  :label="itemChild[item.label]"
                  :value="itemChild[item.value]"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="item.title + '：'" v-if='item.type === "input"' :key="item.title" class="change-label-calss">
            <el-input v-model="requestForm[item.requestKey]" :placeholder="item.placeholder"></el-input>
          </el-form-item>
           <el-form-item :label="item.title + '：'" v-if='item.type === "data"' :key="item.title" class="change-label-calss">
             <el-date-picker
              v-model="requestForm[item.requestKey]"
              type="date"
              :placeholder="item.placeholder"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div class="selectBtn">
        <el-button type="primary" @click="search">查询</el-button>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: "JayaRefer",
  props: {
    selectList: {
      type: Array,
      default: () => [],
    },
    requestForm : {
      type : Object,
      default : () => {}
    }
  },
  data() {
    return {
      
    };
  },
  methods :{
      search () {
          this.$emit('search')
      }
  },
  mounted() {

  },
};
</script>

<style lang="scss" scoped>
  .select-con {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
</style>
