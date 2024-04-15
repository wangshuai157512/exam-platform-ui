<template>
  <div v-if="hisDestroy">
    <jaya-check
      v-bind="$attrs"
      v-for="(lable, index) in lableData"
      v-model="status[index]"
      :check-key="checkKey"
      :key="lable[checkKey]"
      :ckey="index"
      :lableOptions="lable"
      @check-change="handleCheckChange"
    />
  </div>
</template>
<script>
export default {
  name: "JayaCheckGroup",
  props: {
    value: { type: Array },
    checkKey: String,
    lableData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      keys: {},
      status: [],
      hisDestroy: true,
    };
  },
  watch: {
    lableData() {
      // 强制销毁组件
      this.keys = {};
      this.hisDestroy = false;
      this.$nextTick(() => {
        this.hisDestroy = true;
      });
    },
    keys: {
      handler: function (key) {
        const value = [];
        Object.keys(key).forEach((item) => {
          if (key[item]) {
            value.push(...key[item]);
          }
        });
        this.$emit("input", value);
      },
      immediate: true,
      deep: true,
    },
  },
  mounted: function () {},
  methods: {
    handleCheckChange({ childCheckedKeys, ckey }) {
      this.$nextTick(() => {
        if (childCheckedKeys.length) {
          this.$set(this.keys, ckey, [
            this.lableData[ckey][this.checkKey],
            ...childCheckedKeys,
          ]);
        } else {
          this.$set(this.keys, ckey, null);
        }
      });
    },
  },
};
</script>
