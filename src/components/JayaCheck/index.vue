<template>
  <div>
    <div :class="'lable' + levelCount">
      <el-checkbox
        v-model="status"
        :indeterminate="status === null"
        :label="lableOptions[lableKey]"
        @change="handleCheckAllChange"
      ></el-checkbox>
    </div>
    <div :class="'item-label-box' + levelCount">
      <div
        v-for="(label, key) in lableOptions[itemDataKey]"
        :key="key"
        :class="'item-lable' + levelCount"
      >
        <span v-if="label.coreFlag" class="core">*</span>
        <jaya-check
          v-if="label[itemDataKey] && label[itemDataKey].length"
          v-model="itemStatus[key]"
          :level-count="levelCount + 1"
          :ckey="key"
          :check-key="checkKey"
          :lable-key="lableKey"
          :lable-options="label"
          :item-data-key="itemDataKey"
          :init-select-key="initSelectKey"
          @check-change="handleCheckChange"
        />
        <el-checkbox
          v-else
          v-model="itemStatus[key]"
          :label="label[lableKey]"
          @change="handleCheckChangeClick($event ? true : false, key)"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "JayaCheck",
  props: {
    value: { type: Boolean, default: false },
    levelCount: { type: Number, default: 0 }, // 组件嵌套层数
    ckey: { type: Number, default: null }, // 组件key值
    lableOptions: Object,
    lableKey: String,
    initSelectKey: String, // 初始化状态健值
    itemDataKey: String, // 下层组件数据健值
    checkKey: String,
  },
  data() {
    return {
      status: false, //选中状态 true:选中,false:未选中,null:半选
      itemStatus: {}, // 子项状态集合
      checkedKeys: [], // 选中项key列表
      childCheckedKeys: {}, // 子级key集合
    };
  },
  watch: {
    itemStatus: {
      handler(status) {
        const checkedKeys = [];
        Object.keys(status).forEach((key) => {
          if (status[key] === true || status[key] === null) {
            const option = this.lableOptions[this.itemDataKey][key];
            checkedKeys.push(option[this.checkKey]);
          }
        });

        const childCheckedKeys = [...checkedKeys];
        Object.keys(this.childCheckedKeys).forEach((key) => {
          if (this.childCheckedKeys[key])
            childCheckedKeys.push(...this.childCheckedKeys[key]);
        });
        this.$nextTick(() => {
          this.$emit("check-change", {
            childCheckedKeys,
            ckey: this.ckey,
          });
        });
        this.checkedKeys = checkedKeys;
      },
      immediate: true,
      deep: true,
    },

    checkedKeys(value) {
      if (value.length == this.lableOptions[this.itemDataKey].length) {
        const findItemStatus = Object.keys(this.itemStatus)
          .map((key) => this.itemStatus[key])
          .includes(null);
        this.status = findItemStatus ? null : true;
      } else if (value.length == 0) {
        this.status = false;
      } else {
        this.status = null;
      }
      this.$emit("input", this.status);
    },

    childCheckedKeys: {
      handler: function (checkedkeys) {
        const childCheckedKeys = [...this.checkedKeys];
        Object.keys(checkedkeys).forEach((key) => {
          if (checkedkeys[key]) childCheckedKeys.push(...checkedkeys[key]);
        });
        this.$emit("check-change", {
          childCheckedKeys,
          ckey: this.ckey,
        });
      },
      immediate: true,
      deep: true,
    },

    value(value) {
      if (value == null) return;
      this.handleCheckAllChange(value);
    },
  },
  mounted() {
    // 初始化选中状态
    this.initStatus();
  },
  destroyed() {},
  methods: {
    initStatus() {
      const itemStatus = {};
      if (this.lableOptions[this.itemDataKey]) {
        this.lableOptions[this.itemDataKey].forEach((item, key) => {
          if (!item[this.itemDataKey] && item[this.initSelectKey]) {
            itemStatus[key] = true;
          } else {
            itemStatus[key] = false;
          }
        });
        this.itemStatus = itemStatus;
      } else {
        this.itemStatus = this.lableOptions[this.initSelectKey];
      }
    },
    // 单选
    handleCheckChangeClick(status, key) {
      this.$set(this.itemStatus, key, status);
    },
    // 全选
    handleCheckAllChange(status) {
      const itemStatus = {};
      this.lableOptions[this.itemDataKey].forEach((item, key) => {
        itemStatus[key] = status;
      });
      this.itemStatus = itemStatus;
    },
    // 上层组件状态发生变化时回调 ckey 子组件key值
    handleCheckChange({ childCheckedKeys, ckey }) {
      this.$set(this.childCheckedKeys, ckey, childCheckedKeys);
    },
  },
};
</script>
<style lang="scss" scoped>
.actv-inline-block {
  display: inline-block;
  margin-right: 15px;
}
.core {
  color: red;
  margin-left: -7px;
}
.item-lable0 > div {
  display: inline-block;
  margin-left: 3px;
}
</style>
